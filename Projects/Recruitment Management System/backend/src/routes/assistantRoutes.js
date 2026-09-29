const express = require('express');
const router = express.Router();
const { askAssistant, resumeAnalysis } = require('../controllers/assistantController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/ask', protect, authorize('RECRUITER', 'ADMIN'), askAssistant);
router.post('/resume-analysis', protect, authorize('RECRUITER', 'ADMIN'), resumeAnalysis);

module.exports = router;
