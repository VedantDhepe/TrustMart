// middleware/authMiddleware.js
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ error: 'You must be logged in.' });
  }
};
