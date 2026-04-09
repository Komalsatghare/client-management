const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    type: { type: String, enum: ['manual', 'digital'], default: 'manual' },
    content: { type: String },
    location: { type: String },
    contactNumber: { type: String },
    totalCost: { type: String },
    area: { type: String },
    agreementNumber: { type: String },
    meetingPlace: { type: String },
    clientAddress: { type: String },
    plotDetails: { type: String }, 
    lastEditedBy: { type: String },
    clientSigned: { type: Boolean, default: false },
    clientSignedAt: { type: Date },
    adminSigned: { type: Boolean, default: false },
    adminSignedAt: { type: Date },
    status: { type: String, enum: ['Unsigned', 'Partially Signed', 'Active'], default: 'Unsigned' },
    fileUrl: { type: String },
    originalName: { type: String },
    mimetype: { type: String }, // NEW: Stores 'application/pdf', 'image/png', etc.
    size: { type: Number },     // NEW: Stores file size in bytes
    uploadedByRole: { type: String, enum: ['admin', 'client'], default: 'client' },
    uploadedByName: { type: String },
    contractorName: { type: String, default: 'SWAPNIL D. DHANVIJ' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Agreement', agreementSchema);
