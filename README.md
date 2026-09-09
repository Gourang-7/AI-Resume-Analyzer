# AI-Resume-Analyzer

https://ai-resume-analyzer-coral-phi.vercel.app/

An AI-powered resume analysis platform that evaluates resumes against job descriptions, provides ATS compatibility scores, identifies skill gaps, and generates personalized recommendations to improve interview chances.

## 🚀 Features

- **ATS Match & JD Alignment:** AI-driven analysis that scores resume content against specific Job Descriptions or general target roles.
- **Impact Metric Evaluator:** Analyzes bullet points for quantifiable metrics (KPIs) and provides interactive FAQs for adding numerical impact.
- **Smart Bullet Optimization:** Identifies weak action verbs, suggests strong alternatives, and generates optimized, ATS-friendly rewrites for experience bullets.
- **Skill Gap Analysis:** Automatically categorizes and detects missing hard skills, soft skills, and methodologies relative to the target role.
- **Deterministic Document Checks:** Validates the presence of essential sections, contact information, professional emails, and LinkedIn profile links.
- **File Format & Size Validation:** Real-time client-side evaluation of resume file size and extension (e.g., ensuring PDF format under 2MB) for maximum ATS compatibility.
- **API Error Handling:** Prevents front-end crashes during AI timeouts by catching API limits and displaying professional traffic warnings to the user.

## 🛠️ Tech Stack

- **Frontend:** HTML5, Tailwind CSS 4, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **AI Engine:** Google Gemini API
- **Deployment:** Vercel