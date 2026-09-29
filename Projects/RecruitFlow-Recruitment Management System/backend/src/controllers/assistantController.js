const { GoogleGenerativeAI } = require('@google/generative-ai');
const Job = require('../models/Job');
const Application = require('../models/Application');
const CandidateProfile = require('../models/CandidateProfile');

const { analyzeResumeMatch } = require('../services/aiService');

const askAssistant = async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "GEMINI_API_KEY is not configured." });
    }

    // Basic retrieval of data context (mocking a true RAG by fetching high-level stats)
    // To not blow up the token limit, we'll fetch aggregated data or recent jobs/applications.
    const jobs = await Job.find({ status: 'OPEN' }).select('title department location').lean();
    const apps = await Application.find().populate('candidate', 'name').populate('job', 'title').limit(50).lean();
    
    const contextData = {
      openJobs: jobs,
      recentApplications: apps.map(a => ({
        candidateName: a.candidate?.name || 'Unknown',
        jobTitle: a.job?.title || 'Unknown',
        status: a.status,
        score: a.aiScore
      }))
    };

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const prompt = `
      You are the AI Assistant for RecruitFlow, a recruitment management system.
      You help recruiters answer questions about their jobs and candidates.
      Here is the current snapshot of data in the system (JSON format):
      
      ${JSON.stringify(contextData)}
      
      Answer the user's question based strictly on the data provided above.
      If the data provided doesn't contain the answer, say "I don't have enough data in my current context to answer that." Do NOT invent candidates or jobs.
      
      User Question: ${question}
    `;

    const result = await model.generateContent(prompt);
    res.json({ answer: result.response.text() });
  } catch (error) {
    console.error("Assistant Error:", error);
    res.status(500).json({ message: "Failed to process query." });
  }
};

const resumeAnalysis = async (req, res) => {
  try {
    const { applicationId } = req.body;
    const application = await Application.findById(applicationId).populate('job').populate('resume');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (!application.resume || !application.resume.parsedText || application.resume.parsedText.trim() === '') {
      return res.status(400).json({ message: 'Cannot analyze: Resume text is missing or could not be parsed from the PDF.' });
    }
    
    // Call the centralized AI Service
    const aiResult = await analyzeResumeMatch(application.job, application.resume.parsedText);
    
    // Save the result back to application
    application.aiScore = aiResult.score;
    application.aiRecommendation = aiResult.recommendation;
    application.aiAnalysis = {
      matchSummary: aiResult.matchSummary,
      matchingSkills: aiResult.matchingSkills,
      missingSkills: aiResult.missingSkills,
      technicalSkillsMatch: aiResult.technicalSkillsMatch,
      experienceMatch: aiResult.experienceMatch,
      educationMatch: aiResult.educationMatch,
      relevantProjects: aiResult.relevantProjects,
      experienceRelevance: aiResult.experienceRelevance,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      reasoning: aiResult.reasoning
    };
    
    await application.save();
    
    res.json({ message: 'Resume analysis complete', ...aiResult });
  } catch (error) {
    console.error('Resume Analysis Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { askAssistant, resumeAnalysis };
