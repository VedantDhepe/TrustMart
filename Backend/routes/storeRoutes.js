const express = require('express');
const storeController = require('../controllers/storeController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const router = express.Router();

// GET /api/stores (protected)
router.get('/', ensureAuthenticated, storeController.listStores);


// Create store: only 'admin' or 'store_owner' role
router.post(
  '/',
  ensureAuthenticated,
  requireRole('admin', 'store_owner'),
  storeController.createStore
);



router.get(
  '/all',
  ensureAuthenticated,
  requireRole('admin'),
  storeController.adminListStores
);






// Admin/owner: update/delete store
router.put('/:id', ensureAuthenticated, requireRole('admin', 'store_owner'), storeController.updateStore);
router.delete('/:id', ensureAuthenticated, requireRole('admin', 'store_owner'), storeController.deleteStore);




module.exports = router;
