const authMiddleware = (req, res, next) => {
  console.log('Session:', req.session); // Debug session
  console.log('Cookies:', req.cookies); // Debug cookies
  // Check session instead of JWT token
  if (req.headers?.upgrade === 'websocket') {
    return next();  // Or implement your WebSocket auth logic
  }

  if (!req.session.user) {
    return res.status(401).json({ message: 'No session, authorization denied' });
  }

  try {
    console.log('Authenticated user:', req.session.user);
    // Attach session data to request object
    req.user = req.session.user._id;
    req.role = req.session.user.role;
    req.team = req.session.user.team;
    req.username = req.session.user.username;
    req.name = req.session.user.name;

    next();
  } catch (error) { 
    console.error('Session validation error:', error);
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

// New markAsRead middleware
const markAsRead = async (req, res, next) => {
  try {
    if (req.query.markRead === 'true') {
      await Message.updateMany(
        { receiver: req.user.id, read: false },
        { $set: { read: true } }
      );
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  authMiddleware, 
  adminMiddleware,
  markAsRead 
};