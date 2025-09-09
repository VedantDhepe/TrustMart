// dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const dashboardController = require('../controllers/dashboardController');




router.get('/totals', ensureAuthenticated, requireRole('admin'), dashboardController.getTotals);
module.exports = router;



