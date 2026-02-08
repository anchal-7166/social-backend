const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const ErrorHandler = require('../utils/ApiError.js');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
const signup = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return next(new ErrorHandler('Please provide all required fields', 400));
  }

  // Check if user already exists
  const userExists = await User.findOne({ 
    $or: [{ email }, { username }] 
  });

  if (userExists) {
    return next(new ErrorHandler('User with this email or username already exists', 400));
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password
  });

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      token
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return next(new ErrorHandler('Please provide email and password', 400));
  }

  // Find user with password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid credentials', 401));
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler('Invalid credentials', 401));
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      token
    }
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

module.exports = {
  signup,
  login,
  getMe
};