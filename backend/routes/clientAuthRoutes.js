const express = require('express');
const router = express.Router();
const { loginClient, registerClient, changeClientPassword, sendClientOtp, verifyClientOtp, resetClientPassword } = require('../controllers/clientAuthController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// @route   POST /api/client/signup
router.post('/signup', registerClient);

// @route   POST /api/client/login
router.post('/login', loginClient);

// @route   GET /api/client/verify
// @desc    Verify if the client token is still valid
// @access  Private (Client only)
router.get('/verify', verifyToken, authorizeRoles('client'), (req, res) => {
    res.status(200).json({
        message: 'Client token is valid',
        clientId: req.user.id // Changed to user
    });
});

// @route   POST /api/client/change-password
// @desc    Change client's own password
// @access  Private (Client only)
router.post('/change-password', verifyToken, authorizeRoles('client'), changeClientPassword);

// ── Forgot Password (Client) ───────────────────────────────────────────────────
router.post('/forgot-password/send-otp', sendClientOtp);
router.post('/forgot-password/verify-otp', verifyClientOtp);
router.post('/forgot-password/reset', resetClientPassword);

module.exports = router;
