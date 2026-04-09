const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    paymentMode: {
        type: String,
        enum: ['Cash', 'UPI', 'Bank Transfer'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'completed'
    },
    billNumber: {
        type: String,
        required: true,
        unique: true
    },
    billFile: {
        type: String, // Path to the generated PDF
        required: true
    },
    notes: {
        type: String
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', // Indicates which admin recorded the payment
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
