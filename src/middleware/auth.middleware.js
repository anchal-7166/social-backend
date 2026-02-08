const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const ErrorHandler = require('../utils/ApiError.js');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token (excluding password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return next(new ErrorHandler('User not found', 401));
    }

    next();
  } else {
    return next(new ErrorHandler('Not authorized, no token provided', 401));
  }
});

module.exports = { protect };