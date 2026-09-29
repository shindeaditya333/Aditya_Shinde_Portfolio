const { GoogleGenerativeAI } = require('@google/generative-ai');

const analyzeResumeMatch = async (job, resumeText) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  if (!resumeText || resumeText.trim() === '') {
    throw new Error("Resume text is empty or could not be extracted. Please ensure the PDF is valid.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  let lastError = null;
  
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = `
        You are an expert technical recruiter analyzing a candidate's resume for a specific job.
        
        Job Title: ${job.title}
        Job Department: ${job.department}
        Job Description: ${job.description}
        Required Skills: ${job.requiredSkills ? job.requiredSkills.join(', ') : ''}
        Preferred Skills: ${job.preferredSkills ? job.preferredSkills.join(', ') : ''}
        Experience Level: ${job.experienceLevel}
        
        Candidate Resume Text:
        ${resumeText}
        
        Evaluate the candidate for this job. Return a strict JSON object (NO Markdown formatting, just the raw JSON) with the following structure:
        {
          "score": (a number between 0 and 100),
          "recommendation": (one of: "SHORTLIST", "CONSIDER", "REJECT"),
          "matchSummary": "A concise overall summary of the match",
          "matchingSkills": [array of skills the candidate has that match requirements],
          "missingSkills": [array of required/preferred skills the candidate is missing],
          "technicalSkillsMatch": "Evaluation of technical skills match",
          "experienceMatch": "Evaluation of experience years and level match",
          "educationMatch": "Evaluation of education match",
          "relevantProjects": "Notes on relevant projects or certifications",
          "experienceRelevance": "How relevant their past experience is to this role",
          "strengths": [an array of string bullet points highlighting strong points],
          "weaknesses": [an array of string bullet points highlighting gaps or concerns],
          "reasoning": "A concise paragraph summarizing your evaluation reasoning."
        }
      `;

      const result = await model.generateContent(prompt);
      let text = result.response.text();
      
      // Clean up potential markdown formatting that Gemini might return
      if (text.startsWith('```json')) {
        text = text.substring(7);
      } else if (text.startsWith('```')) {
        text = text.substring(3);
      }
      if (text.endsWith('```')) {
        text = text.substring(0, text.length - 3);
      }
      
      text = text.trim();
      
      return JSON.parse(text);
    } catch (error) {
      console.error(`AI Analysis Error (Attempt ${attempt}):`, error.message);
      lastError = error;
      if (attempt < 2 && (error.status === 503 || error.status === 429)) {
        let delayMs = 2000;
        const match = error.message.match(/retry in ([\d\.]+)s/);
        if (match) {
          delayMs = Math.ceil(parseFloat(match[1]) * 1000) + 500;
        }
        if (delayMs > 5000) delayMs = 5000; // Cap delay at 5s
        
        console.log(`Rate limit/Server error. Waiting ${delayMs}ms before retry...`);
        await new Promise(r => setTimeout(r, delayMs));
        continue;
      }
      break;
    }
  }
  
  throw new Error(`AI Analysis failed: ${lastError ? lastError.message : 'Unknown error'}`);
};

module.exports = { analyzeResumeMatch };
