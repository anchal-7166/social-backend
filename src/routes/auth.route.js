const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/auth.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;