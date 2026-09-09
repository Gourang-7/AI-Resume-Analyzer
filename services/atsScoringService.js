// services/atsScoringService.js

export function analyzeATSFormat(text, jdKeywords = []) {
  const textLower = text.toLowerCase();
  
  // 1. Contact & Metadata Checks (20 points)
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(text);
  const hasLinkedIn = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i.test(text);
  const hasGitHubOrPortfolio = /(github\.com|gitlab\.com|bitbucket\.org|portfolio)/i.test(text);

  let contactScore = 0;
  if (hasEmail) contactScore += 5;
  if (hasPhone) contactScore += 5;
  if (hasLinkedIn) contactScore += 5;
  if (hasGitHubOrPortfolio) contactScore += 5;

  // 2. Section Headers Check (30 points)
  const sections = {
    education: /(education|academic background)/i.test(textLower),
    experience: /(experience|work history|employment)/i.test(textLower),
    projects: /(projects|personal projects)/i.test(textLower),
    skills: /(skills|technical skills|core competencies)/i.test(textLower)
  };

  let sectionScore = 0;
  if (sections.education) sectionScore += 7.5;
  if (sections.experience) sectionScore += 7.5;
  if (sections.projects) sectionScore += 7.5;
  if (sections.skills) sectionScore += 7.5;

  // 3. Keyword Matching (50 points)
  // For example, if testing against a Data Science intern role at World Wide Technology, 
  // you might pass ['c++', 'python', 'machine learning', 'sql', 'data structures'] as jdKeywords.
  let keywordScore = 50; // Default to full points if no Job Description is provided
  let matchedKeywords = [];
  let missingKeywords = [];

  if (jdKeywords.length > 0) {
    let matchCount = 0;
    jdKeywords.forEach(keyword => {
      if (textLower.includes(keyword.toLowerCase())) {
        matchCount++;
        matchedKeywords.push(keyword);
      } else {
        missingKeywords.push(keyword);
      }
    });
    keywordScore = Math.round((matchCount / jdKeywords.length) * 50);
  }

  const totalDeterministicScore = contactScore + sectionScore + keywordScore;

  return {
    score: totalDeterministicScore,
    breakdown: {
      contactScore,
      sectionScore,
      keywordScore
    },
    foundData: {
      hasEmail,
      hasPhone,
      hasLinkedIn,
      hasGitHubOrPortfolio,
      sectionsFound: sections
    },
    keywords: {
      matched: matchedKeywords,
      missing: missingKeywords
    }
  };
}