// middleware/roleMiddleware.js
exports.requireRole = (...roles) => (req, res, next) => {
  // req.user is populated by Passport after login
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied.' });
  }
  next();
};
