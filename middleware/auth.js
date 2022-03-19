const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  // Split headers to get userToken
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  // Make sure token exists
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorize to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    return next();
  } catch (e) {
    console.log(e.message);
    return res
      .status(401)
      .json({ success: false, message: 'Not authorize to access this route' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        sucess: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
