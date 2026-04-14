const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true, trim: true },
    email: { type: String, required: true },
    phone: String,
    project: String, // Project Name or Type
    projectStatus: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
        default: 'Not Started'
    },
    notes: String,
    password: {
        type: String,
        required: [false, 'Password is optional']
    },
    role: {
        type: String,
        default: 'client'
    },
    notifications: [{
        message: String,
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    otpCode: { type: String },
    otpExpiry: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
