const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Pending', 'On Hold'],
        default: 'Pending'
    },
    startDate: Date,
    endDate: Date, // Optional
    deadline: String, // e.g., "3 months"

    // New Payment Engine fields
    totalBudget: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    paymentStatus: {
        type: String,
        enum: ['pending', 'partial', 'completed'],
        default: 'pending'
    },

    paymentDetails: String,

    // Services with pricing
    services: [{
        name: String,
        price: String
    }],

    progress: [{
        title: String,
        description: String,
        date: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed'],
            default: 'Pending'
        }
    }],

    notes: String,
    locationLink: String, // Google Maps link etc.
    images: [String] // Array of image file paths
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
