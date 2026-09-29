const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, updateJob, updateJobStatus, deleteJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Optional protect for GET to allow public and private behavior
const optionalProtect = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.route('/')
  .get(optionalProtect, getJobs)
  .post(protect, authorize('RECRUITER', 'ADMIN'), createJob);

router.route('/:id')
  .get(optionalProtect, getJobById)
  .put(protect, authorize('RECRUITER', 'ADMIN'), updateJob)
  .delete(protect, authorize('RECRUITER', 'ADMIN'), deleteJob);

router.patch('/:id/status', protect, authorize('RECRUITER', 'ADMIN'), updateJobStatus);

module.exports = router;
