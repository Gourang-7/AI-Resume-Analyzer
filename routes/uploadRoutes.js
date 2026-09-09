import express from "express";
import multer from "multer";
import Analysis from "../models/Analysis.js"; 

import { extractTextFromBuffer } from "../services/parserService.js";
import { analyzeATSFormat } from "../services/atsScoringService.js";
import { analyzeResumeWithGemini } from "../services/geminiService.js"; 

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/analyze", upload.fields([{ name: "resume", maxCount: 1 }, { name: "jdFile", maxCount: 1 }]), async (req, res) => {
  try {
    if (!req.files || !req.files['resume']) {
      return res.status(400).json({ error: "No resume file uploaded." });
    }

    const resumeBuffer = req.files['resume'][0].buffer;
    const resumeMime = req.files['resume'][0].mimetype;
    const resumeText = await extractTextFromBuffer(resumeBuffer, resumeMime);

    const jobRole = req.body.jobRole || "General Application";
    let jobDescriptionText = req.body.jobDescription || "";
    let isJDUploaded = false;

    if (req.files['jdFile']) {
      const jdBuffer = req.files['jdFile'][0].buffer;
      const jdMime = req.files['jdFile'][0].mimetype;
      jobDescriptionText = await extractTextFromBuffer(jdBuffer, jdMime);
      isJDUploaded = true;
    }
    
    const targetContext = `Target Role: ${jobRole}\nAdditional JD Context: ${jobDescriptionText}`;
    const textToScan = jobDescriptionText ? jobDescriptionText : jobRole;
    const jdKeywords = textToScan.split(/\s+/).filter(w => w.length > 4).slice(0, 10);
    
    const rulesAnalysis = analyzeATSFormat(resumeText, jdKeywords);
    const aiAnalysis = await analyzeResumeWithGemini(resumeText, targetContext, isJDUploaded);

    const finalScore = isJDUploaded 
        ? aiAnalysis.alignmentScore 
        : Math.min(100, rulesAnalysis.score + (aiAnalysis.aiScoreBonus || 15));

    // --- NEW: Save to MongoDB ---
    const newReport = new Analysis({
      jobRole: jobRole,
      isJDUploaded: isJDUploaded,
      finalScore: finalScore,
      documentChecks: {
        hasEssentialSections: !!(rulesAnalysis.foundData?.sectionsFound?.education && rulesAnalysis.foundData?.sectionsFound?.experience),
        hasContactInfo: !!(rulesAnalysis.foundData?.hasPhone || rulesAnalysis.foundData?.hasEmail),
        hasLinkedIn: !!rulesAnalysis.foundData?.hasLinkedIn,
        hasEmail: !!rulesAnalysis.foundData?.hasEmail
      },
      aiFeedback: aiAnalysis
    });

    const savedReport = await newReport.save();
    // -----------------------------

    res.status(200).json({
      status: "success",
      reportId: savedReport._id, // Send the DB ID back to the client!
      finalScore: finalScore,
      isJDAlignment: isJDUploaded,
      deterministicFeedback: rulesAnalysis,
      aiFeedback: aiAnalysis
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;