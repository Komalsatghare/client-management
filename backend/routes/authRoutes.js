const express = require('express');
const router = express.Router();
const { loginAdmin, changePassword, universalLogin, sendAdminOtp, verifyAdminOtp, resetAdminPassword, getMe, updateMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware'); // Replaced old 'protect'

// @route   POST /api/auth/register
// @desc    Register a new admin & get token
// @access  Public
// router.post('/register', registerAdmin); (Removed as per requirements)


// @route   POST /api/auth/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', loginAdmin);

// @route   POST /api/auth/universal-login
// @desc    Unified Gateway to check Admin or Client Database Table
// @access  Public
router.post('/universal-login', universalLogin);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', verifyToken, getMe);

// @route   PATCH /api/auth/me
// @desc    Update current user profile
// @access  Private
router.patch('/me', verifyToken, updateMe);

// @route   POST /api/auth/change-password
// @desc    Update admin password
// @access  Private
router.post('/change-password', verifyToken, changePassword);

// ── Forgot Password (Admin) ───────────────────────────────────────────────────
router.post('/forgot-password/send-otp', sendAdminOtp);
router.post('/forgot-password/verify-otp', verifyAdminOtp);
router.post('/forgot-password/reset', resetAdminPassword);

module.exports = router;
