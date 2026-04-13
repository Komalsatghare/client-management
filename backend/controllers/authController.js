const Admin = require('../models/Admin');
const Client = require('../models/Client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc    Register a new Admin & get token
// @route   POST /api/auth/register
// @access  Public
// registerAdmin removed as per requirements


// @desc    Auth Admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate request
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        const fixedEmail = "swapnildhanvij@gmail.com";
        const fixedPassword = "swapnil@60+";
        const identifier = username.toLowerCase().trim();

        // Check against fixed credentials
        if (identifier !== fixedEmail || password !== fixedPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Fetch the admin record from DB to get the actual ID and other details
        const admin = await Admin.findOne({ email: fixedEmail });
        
        if (!admin) {
            return res.status(401).json({ message: 'Admin account not found in database' });
        }

        // Generate JWT
        const payload = {
            user: {
                id: admin._id,
                role: admin.role,
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d', 
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @desc    Change admin password
// @route   POST /api/auth/change-password
// @access  Private (Admin only)
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Validate request
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide old and new passwords' });
        }

        // The admin's ID should be in req.admin from the auth middleware
        const adminUser = await Admin.findById(req.user.id);
        if (!adminUser) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Check current password
        const isMatch = await bcrypt.compare(oldPassword, adminUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect old password' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password in DB
        adminUser.password = hashedPassword;
        await adminUser.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ message: 'Server error while changing password' });
    }
};

// @desc    Universal Login (Checks Admin then Client)
// @route   POST /api/auth/universal-login
// @access  Public
const universalLogin = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Please provide credentials' });
        }

        // 1. Check Admin Credentials (Fixed)
        const fixedEmail = "swapnildhanvij@gmail.com";
        const fixedPassword = "swapnil@60+";
        const inputIdentifier = identifier.toLowerCase().trim();

        if (inputIdentifier === fixedEmail && password === fixedPassword) {
            const admin = await Admin.findOne({ email: fixedEmail });
            if (admin) {
                const payload = { user: { id: admin._id, role: admin.role } };
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
                return res.status(200).json({
                    message: 'Admin login successful',
                    token,
                    role: 'admin',
                    user: { 
                        id: admin._id, 
                        username: admin.username,
                        name: admin.name,
                        email: admin.email,
                        phone: admin.phone
                    }
                });
            }
        }


        // 2. Check Client Collection (if not Admin)
        const client = await Client.findOne({ 
            $or: [
                { email: identifier.toLowerCase().trim() },
                { username: identifier.trim() }
            ]
        });
        if (client) {
            const isMatch = await bcrypt.compare(password, client.password);
            if (isMatch) {
                const payload = { user: { id: client._id, role: client.role } };
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
                return res.status(200).json({
                    message: 'Client login successful',
                    token,
                    role: 'client',
                    user: { id: client._id, name: client.name, email: client.email }
                });
            }
        }

        // If neither matched
        return res.status(401).json({ message: 'Invalid credentials' });

    } catch (error) {
        console.error('Universal Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// ─── FORGOT PASSWORD — ADMIN ─────────────────────────────────────────────────
const { sendOtpEmail } = require('../utils/emailService');
const crypto = require('crypto');

// Step 1: Send OTP to admin email
// POST /api/auth/forgot-password/send-otp
const sendAdminOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (!admin) return res.status(404).json({ message: 'No admin account found with this email address' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        admin.otpCode = otp;
        admin.otpExpiry = expiry;
        await admin.save();

        await sendOtpEmail(email, admin.username, otp);

        res.status(200).json({ message: 'OTP sent to your email address' });
    } catch (error) {
        console.error('Admin Send OTP Error:', error);
        res.status(500).json({ message: 'Failed to send OTP. Please check email configuration.' });
    }
};

// Step 2: Verify OTP
// POST /api/auth/forgot-password/verify-otp
const verifyAdminOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (!admin || !admin.otpCode) return res.status(400).json({ message: 'Invalid request. Please request a new OTP.' });

        if (admin.otpExpiry < new Date()) return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        if (admin.otpCode !== otp.trim()) return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });

        // OTP is valid — generate a short-lived reset token so the next step is secure
        const resetToken = crypto.randomBytes(32).toString('hex');
        admin.otpCode = `VERIFIED:${resetToken}`; // mark as verified
        admin.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 more minutes for reset
        await admin.save();

        res.status(200).json({ message: 'OTP verified successfully', resetToken });
    } catch (error) {
        console.error('Admin Verify OTP Error:', error);
        res.status(500).json({ message: 'Server error during OTP verification' });
    }
};

// Step 3: Reset password
// POST /api/auth/forgot-password/reset
const resetAdminPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;
        if (!email || !resetToken || !newPassword) return res.status(400).json({ message: 'All fields are required' });
        if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        if (!admin.otpCode || !admin.otpCode.startsWith('VERIFIED:')) return res.status(400).json({ message: 'OTP not verified. Please start again.' });
        if (admin.otpExpiry < new Date()) return res.status(400).json({ message: 'Reset session expired. Please start again.' });

        const storedToken = admin.otpCode.replace('VERIFIED:', '');
        if (storedToken !== resetToken) return res.status(400).json({ message: 'Invalid reset token' });

        // Update password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        admin.otpCode = undefined;
        admin.otpExpiry = undefined;
        await admin.save();

        res.status(200).json({ message: 'Password reset successfully! You can now log in.' });
    } catch (error) {
        console.error('Admin Reset Password Error:', error);
        res.status(500).json({ message: 'Server error during password reset' });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const admin = await Admin.findById(req.user.id).select('-password');
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            return res.status(200).json({
                role: 'admin',
                user: {
                    id: admin._id,
                    username: admin.username,
                    name: admin.name || 'Admin',
                    email: admin.email || '',
                    phone: admin.phone || '',
                }
            });
        } else if (req.user.role === 'client') {
            const client = await Client.findById(req.user.id).select('-password');
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            return res.status(200).json({
                role: 'client',
                user: {
                    id: client._id,
                    name: client.name,
                    email: client.email,
                    phone: client.phoneNumber,
                }
            });
        } else {
            return res.status(400).json({ message: 'Invalid user role' });
        }
    } catch (error) {
        console.error('Get Me Error:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};

// @desc    Update current user profile
// @route   PATCH /api/auth/me
// @access  Private
const updateMe = async (req, res) => {
    try {
        const { username, name, email, phone } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole === 'admin') {
            const admin = await Admin.findById(userId);
            if (!admin) return res.status(404).json({ message: 'Admin not found' });

            // Check if username or email is already taken by another admin
            if (username && username !== admin.username) {
                const usernameExists = await Admin.findOne({ username });
                if (usernameExists) return res.status(400).json({ message: 'Username is already taken' });
                admin.username = username;
            }

            if (email && email !== admin.email) {
                const emailExists = await Admin.findOne({ email });
                if (emailExists) return res.status(400).json({ message: 'Email is already taken' });
                admin.email = email;
            }

            if (name !== undefined) admin.name = name;
            if (phone !== undefined) admin.phone = phone;

            await admin.save();

            res.status(200).json({
                message: 'Profile updated successfully',
                user: {
                    id: admin._id,
                    username: admin.username,
                    name: admin.name,
                    email: admin.email,
                    phone: admin.phone,
                }
            });
        } else {
            return res.status(400).json({ message: 'Profile update only available for administrators via this endpoint' });
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};

module.exports = {
    loginAdmin,
    changePassword,
    universalLogin,
    sendAdminOtp,
    verifyAdminOtp,
    resetAdminPassword,
    getMe,
    updateMe,
};
