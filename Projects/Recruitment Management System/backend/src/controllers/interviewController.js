const Interview = require('../models/Interview');
const Application = require('../models/Application');

// @desc    Schedule an interview
// @route   POST /api/interviews
// @access  Private (RECRUITER, ADMIN)
const scheduleInterview = async (req, res) => {
  try {
    const { application, interviewer, date, type, meetingLink } = req.body;
    
    const interview = new Interview({
      application, interviewer, date, type, meetingLink
    });

    const savedInterview = await interview.save();

    // Link interview to application
    await Application.findByIdAndUpdate(application, {
      $push: { interviews: savedInterview._id },
      status: 'INTERVIEW'
    });

    res.status(201).json(savedInterview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get interviews for current user (Interviewer or Candidate)
// @route   GET /api/interviews/my
// @access  Private (INTERVIEWER, CANDIDATE)
const getMyInterviews = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'INTERVIEWER') {
      query.interviewer = req.user._id;
    } else if (req.user.role === 'CANDIDATE') {
      // Find applications for candidate
      const applications = await Application.find({ candidate: req.user._id }).select('_id');
      const appIds = applications.map(a => a._id);
      query.application = { $in: appIds };
    }

    const interviews = await Interview.find(query)
      .populate({
        path: 'application',
        populate: [
          { path: 'candidate', select: 'name email phone' },
          { path: 'job', select: 'title department' }
        ]
      })
      .sort('date');
      
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all interviews (Recruiter)
// @route   GET /api/interviews
// @access  Private (RECRUITER, ADMIN)
const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate('interviewer', 'name email')
      .populate({
        path: 'application',
        populate: [
          { path: 'candidate', select: 'name email' },
          { path: 'job', select: 'title department' }
        ]
      })
      .sort('-date');
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit interview feedback
// @route   PUT /api/interviews/:id/feedback
// @access  Private (INTERVIEWER)
const submitFeedback = async (req, res) => {
  try {
    const { score, feedback, notes } = req.body;
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    
    if (interview.interviewer.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    interview.score = score;
    interview.feedback = feedback;
    interview.notes = notes;
    interview.status = 'COMPLETED';
    
    await interview.save();
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get interviews for a specific application
// @route   GET /api/interviews/application/:applicationId
// @access  Private (RECRUITER, ADMIN)
const getInterviewsByApplication = async (req, res) => {
  try {
    const interviews = await Interview.find({ application: req.params.applicationId })
      .populate('interviewer', 'name email')
      .sort('-date');
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { scheduleInterview, getMyInterviews, getAllInterviews, submitFeedback, getInterviewsByApplication };
