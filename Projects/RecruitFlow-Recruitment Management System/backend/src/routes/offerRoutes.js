const express = require('express');
const router = express.Router();
const { createOffer, getMyOffers, updateOfferStatus, downloadOfferPDF } = require('../controllers/offerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('RECRUITER', 'ADMIN'), createOffer);
router.get('/my', authorize('CANDIDATE'), getMyOffers);
router.patch('/:id/status', authorize('CANDIDATE'), updateOfferStatus);
router.get('/:id/pdf', downloadOfferPDF);

module.exports = router;
