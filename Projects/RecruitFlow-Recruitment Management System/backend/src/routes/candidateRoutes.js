const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadResume } = require('../controllers/candidateController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);
router.use(authorize('CANDIDATE'));

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.post('/resume', upload.single('resume'), uploadResume);

module.exports = router;
