const express = require('express');
const router = express.Router();
const { applyToJob, getMyApplications, getAllApplications, getJobApplications, updateApplicationStatus, analyzeApplication } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Candidate routes
const upload = require('../middleware/uploadMiddleware');
router.post('/:jobId/apply', authorize('CANDIDATE'), upload.single('resume'), applyToJob);
router.get('/my', authorize('CANDIDATE'), getMyApplications);

// Recruiter routes
router.get('/', authorize('RECRUITER', 'ADMIN'), getAllApplications);
router.get('/job/:jobId', authorize('RECRUITER', 'ADMIN'), getJobApplications);
router.patch('/:id/status', authorize('RECRUITER', 'ADMIN'), updateApplicationStatus);
router.post('/:id/analyze', authorize('RECRUITER', 'ADMIN'), analyzeApplication);

module.exports = router;
