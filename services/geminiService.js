import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeResumeWithGemini(resumeText, targetContext = "", isJDUploaded = false) {
  try {
    const prompt = `
      You are an expert technical recruiter and ATS algorithm. 
      Analyze the resume against the target context. 
      Is a formal Job Description provided for alignment? ${isJDUploaded}
      
      Resume: ${resumeText}
      Target Context: ${targetContext}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        // 1. ADD TEMPERATURE HERE TO STOP HALLUCINATIONS
        temperature: 0.2, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quantificationScore: { type: Type.NUMBER },
            alignmentScore: { type: Type.NUMBER },
            aiScoreBonus: { type: Type.NUMBER },
            extractedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingHardSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingMethodologies: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSoftSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            weakVerbsFound: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  verb: { type: Type.STRING },
                  suggestion: { type: Type.STRING }
                }
              }
            },
            bulletImprovements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  // 2. ADD STRICT LENGTH DESCRIPTIONS HERE
                  improved: { type: Type.STRING, description: "The rewritten bullet point. Must be exactly one concise sentence." },
                  reason: { type: Type.STRING, description: "Strictly 1 short sentence explaining why it was changed." }
                }
              }
            },
            improvementTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            // Update this line inside services/geminiService.js
            alignmentSuggestions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "Give 4-5 specific tips on tailoring the resume to the target job role and any provided description." 
            },
            grammarAndSpellingFeedback: { type: Type.STRING },
            bulletFormattingFeedback: { type: Type.STRING },
            executiveSummary: { type: Type.STRING }
          },
          required: [
            "quantificationScore", "alignmentScore", "missingHardSkills", "missingMethodologies", "missingSoftSkills", 
            "weakVerbsFound", "bulletImprovements", "improvementTips", "alignmentSuggestions", "executiveSummary", "grammarAndSpellingFeedback", "bulletFormattingFeedback"
          ]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Check if it's a rate limit error
    if (error.status === 429 || error.message.includes("429")) {
        throw new Error("Whoops! We're getting too many requests right now. Please wait about 30 seconds and try again.");
    }
    
    throw new Error("The AI analysis engine is currently experiencing high demand. Please try again in a few minutes.");
  }
}