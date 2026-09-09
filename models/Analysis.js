import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema({
  jobRole: { type: String, required: true },
  isJDUploaded: { type: Boolean, default: false },
  finalScore: { type: Number, required: true },
  
  // Deterministic checks summary
  documentChecks: {
    hasEssentialSections: Boolean,
    hasContactInfo: Boolean,
    hasLinkedIn: Boolean,
    hasEmail: Boolean
  },

  // The nested AI feedback object
  aiFeedback: {
    quantificationScore: Number,
    alignmentScore: Number,
    executiveSummary: String,
    grammarAndSpellingFeedback: String,
    bulletFormattingFeedback: String,
    
    extractedKeywords: [String],
    missingHardSkills: [String],
    missingMethodologies: [String],
    missingSoftSkills: [String],
    improvementTips: [String],
    alignmentSuggestions: [String],

    weakVerbsFound: [{
      verb: String,
      suggestion: String
    }],
    
    bulletImprovements: [{
      original: String,
      improved: String,
      reason: String
    }]
  },
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Analysis", AnalysisSchema);