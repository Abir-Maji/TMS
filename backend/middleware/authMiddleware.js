const authMiddleware = (req, res, next) => {
  // Check session instead of JWT token
  if (!req.session.user) {
    return res.status(401).json({ message: 'No session, authorization denied' });
  }

  try {
    // Attach session data to request object
    req.user = req.session.user._id;
    req.role = req.session.user.role;
    req.team = req.session.user.team;
    req.username = req.session.user.username;
    req.name = req.session.user.name;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid session' });
  }
};

// Additional role-based middleware
const adminMiddleware = (req, res, next) => {
  if (req.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };