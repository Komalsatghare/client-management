const Client = require('../models/Client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc    Auth Client & get token
// @route   POST /api/clientAuth/login
// @access  Public
const loginClient = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Validate request
        if (!identifier || !password) {
            return res.status(400).json({ message: 'Please provide email/username and password' });
        }

        // Check for client user
        const client = await Client.findOne({ 
            $or: [
                { email: identifier.toLowerCase().trim() },
                { username: identifier.trim() }
            ]
        });
        if (!client) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, client.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const payload = {
            user: {
                id: client._id,
                role: client.role || 'client',
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d', // Token expires in 1 day
        });

        res.status(200).json({
            message: 'Client login successful',
            token,
            client: {
                id: client._id,
                name: client.name,
                username: client.username,
                email: client.email,
                phone: client.phone,
            }
        });
    } catch (error) {
        console.error('Client Login Error:', error);
        res.status(500).json({ message: 'Server error during client login' });
    }
};

// @desc    Register a new Client & get token
// @route   POST /api/clientAuth/register
// @access  Public
const registerClient = async (req, res) => {
    try {
        const { name, username, email, password, phone, role } = req.body;

        // Validate request
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password' });
        }

        // Check if client already exists
        const clientExists = await Client.findOne({ 
            $or: [
                { email: email.toLowerCase().trim() },
                { username: username ? username.trim() : undefined }
            ].filter(query => query.username !== undefined || query.email !== undefined)
        });
        if (clientExists) {
            return res.status(400).json({ message: 'Client with this email or username already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the client
        const client = await Client.create({
            name,
            username: username ? username.trim() : undefined,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            phone: phone || '',
            role: role || 'client'
        });

        if (client) {
            // Generate JWT
            const payload = {
                user: {
                    id: client._id,
                    role: client.role,
                },
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1d', // Token expires in 1 day
            });

            res.status(201).json({
                message: 'Client registered successfully',
                token,
                client: {
                    id: client._id,
                    name: client.name,
                    username: client.username,
                    email: client.email,
                }
            });
        } else {
            res.status(400).json({ message: 'Invalid client data' });
        }
    } catch (error) {
        console.error('Client Registration Error:', error);
        res.status(500).json({ message: 'Server error during client registration' });
    }
};

// @desc    Change client password
// @route   POST /api/client/change-password
// @access  Private (Client only)
const changeClientPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide old and new passwords' });
        }

        const client = await Client.findById(req.user.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, client.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        client.password = await bcrypt.hash(newPassword, salt);
        await client.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change Client Password Error:', error);
        res.status(500).json({ message: 'Server error while changing password' });
    }
};

// ─── FORGOT PASSWORD — CLIENT ─────────────────────────────────────────────────
const { sendOtpEmail } = require('../utils/emailService');
const crypto = require('crypto');

// Step 1: Send OTP to client email
// POST /api/client/forgot-password/send-otp
const sendClientOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const client = await Client.findOne({ email: email.toLowerCase().trim() });
        if (!client) return res.status(404).json({ message: 'No account found with this email address' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        client.otpCode = otp;
        client.otpExpiry = expiry;
        await client.save();

        await sendOtpEmail(email, client.name, otp);

        res.status(200).json({ message: 'OTP sent to your email address' });
    } catch (error) {
        console.error('Client Send OTP Error:', error);
        res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
};

// Step 2: Verify OTP
// POST /api/client/forgot-password/verify-otp
const verifyClientOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

        const client = await Client.findOne({ email: email.toLowerCase().trim() });
        if (!client || !client.otpCode) return res.status(400).json({ message: 'Invalid request. Please request a new OTP.' });

        if (client.otpExpiry < new Date()) return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        if (client.otpCode !== otp.trim()) return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });

        // OTP is valid — generate a short-lived reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        client.otpCode = `VERIFIED:${resetToken}`;
        client.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await client.save();

        res.status(200).json({ message: 'OTP verified successfully', resetToken });
    } catch (error) {
        console.error('Client Verify OTP Error:', error);
        res.status(500).json({ message: 'Server error during OTP verification' });
    }
};

// Step 3: Reset password
// POST /api/client/forgot-password/reset
const resetClientPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;
        if (!email || !resetToken || !newPassword) return res.status(400).json({ message: 'All fields are required' });
        if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

        const client = await Client.findOne({ email: email.toLowerCase().trim() });
        if (!client) return res.status(404).json({ message: 'Client not found' });
        if (!client.otpCode || !client.otpCode.startsWith('VERIFIED:')) return res.status(400).json({ message: 'OTP not verified. Please start again.' });
        if (client.otpExpiry < new Date()) return res.status(400).json({ message: 'Reset session expired. Please start again.' });

        const storedToken = client.otpCode.replace('VERIFIED:', '');
        if (storedToken !== resetToken) return res.status(400).json({ message: 'Invalid reset token' });

        const salt = await bcrypt.genSalt(10);
        client.password = await bcrypt.hash(newPassword, salt);
        client.otpCode = undefined;
        client.otpExpiry = undefined;
        await client.save();

        res.status(200).json({ message: 'Password reset successfully! You can now log in.' });
    } catch (error) {
        console.error('Client Reset Password Error:', error);
        res.status(500).json({ message: 'Server error during password reset' });
    }
};

module.exports = {
    loginClient,
    registerClient,
    changeClientPassword,
    sendClientOtp,
    verifyClientOtp,
    resetClientPassword,
};
