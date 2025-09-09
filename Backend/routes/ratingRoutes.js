const express = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const ratingController = require('../controllers/ratingController');
const router = express.Router();

router.post('/', ensureAuthenticated, ratingController.submitRating);



// Store owner dashboard
router.get(
  '/owner-dashboard',
  ensureAuthenticated,
  requireRole('store_owner'),
  ratingController.ownerDashboard
);



module.exports = router;
