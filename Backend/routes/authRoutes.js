const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const   router = express.Router();
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Registration route (already present)
router.post('/register', authController.register);

// Login route using Passport with proper controller delegation
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ error: info && info.message ? info.message : "Invalid email or password." });
    req.logIn(user, (err) => {
      if (err) return next(err);
      // Success: delegate to controller for standard response
      return authController.login(req, res, next);
    });
  })(req, res, next);
});


router.get('/me', ensureAuthenticated, authController.whoami);



router.post('/logout', require('../middleware/authMiddleware').ensureAuthenticated, authController.logout);



module.exports = router;
