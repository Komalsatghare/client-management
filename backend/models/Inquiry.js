const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'New' }, // e.g., New, Contacted, Resolved
    reply: { type: String, default: '' },
    repliedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
