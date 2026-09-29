require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./src/models/Application');
const Job = require('./src/models/Job');
const Resume = require('./src/models/Resume');
const { analyzeResumeMatch } = require('./src/services/aiService');

async function testAI() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Find any application that has a resume with parsed text
    const application = await Application.findOne().populate('job').populate('resume');
    
    if (!application) {
      console.log('No applications found in the DB.');
      process.exit(0);
    }

    if (!application.resume || !application.resume.parsedText) {
      console.log('Application found, but its resume has no parsed text.');
      process.exit(0);
    }

    console.log('Testing with Application ID:', application._id);
    console.log('Job Title:', application.job.title);
    console.log('Resume length (characters):', application.resume.parsedText.length);

    console.log('Analyzing resume...');
    const result = await analyzeResumeMatch(application.job, application.resume.parsedText);
    
    console.log('--- AI RESULT ---');
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    mongoose.disconnect();
  }
}

testAI();
