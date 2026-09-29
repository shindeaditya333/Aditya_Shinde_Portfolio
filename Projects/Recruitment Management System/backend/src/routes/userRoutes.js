const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('ADMIN', 'RECRUITER'));

router.get('/', getAllUsers);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
