const express = require('express');
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const userController = require('../controllers/userController');
const router = express.Router();



//Admin : lists/filter users
router.get(
  '/',
  ensureAuthenticated,
  requireRole('admin'),
  userController.adminListUsers
);



// Admin: create user 
router.post('/create', ensureAuthenticated, requireRole('admin'), userController.adminCreateUser);


// User: change password
router.put('/change-password', ensureAuthenticated, userController.changePassword);

// Admin: update/delete user
router.put('/:id', ensureAuthenticated, requireRole('admin'), userController.adminUpdateUser);
router.delete('/:id', ensureAuthenticated, requireRole('admin'), userController.adminDeleteUser);







module.exports = router;
