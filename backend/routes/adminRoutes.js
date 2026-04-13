const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/authController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// @route   POST /api/admin/signup
// router.post('/signup', registerAdmin); removed as per requirement


// @route   POST /api/admin/login
router.post('/login', loginAdmin);

// @route   GET /api/admin/dashboard
// @desc    Admin dashboard example - Protected route
// @access  Private
router.get('/dashboard', verifyToken, authorizeRoles('admin'), (req, res) => {
    // Access the verified admin ID from req.user
    res.status(200).json({
        message: 'Welcome to the Admin Dashboard',
        adminId: req.user.id // Changed to user
    });
});

const Admin = require('../models/Admin');

// @route   PATCH /api/admin/update-email
// @desc    Update admin's recovery email address
// @access  Private (Admin only)
router.patch('/update-email', verifyToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }
        const admin = await Admin.findByIdAndUpdate(req.user.id, { email: email.toLowerCase().trim() }, { new: true });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        res.status(200).json({ message: 'Recovery email updated successfully', email: admin.email });
    } catch (err) {
        console.error('Update email error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
