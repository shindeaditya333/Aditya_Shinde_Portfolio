const express = require('express');
const router = express.Router();
const { scheduleInterview, getMyInterviews, getAllInterviews, submitFeedback, getInterviewsByApplication } = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('RECRUITER', 'ADMIN'), scheduleInterview);
router.get('/', authorize('RECRUITER', 'ADMIN'), getAllInterviews);
router.get('/my', authorize('INTERVIEWER', 'CANDIDATE'), getMyInterviews);
router.get('/application/:applicationId', authorize('RECRUITER', 'ADMIN'), getInterviewsByApplication);
router.put('/:id/feedback', authorize('INTERVIEWER', 'ADMIN'), submitFeedback);

module.exports = router;
