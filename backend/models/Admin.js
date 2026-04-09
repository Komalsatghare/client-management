const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        role: {
            type: String,
            default: 'admin'
        },
        otpCode: { type: String },
        otpExpiry: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
