const mongoose = require('mongoose');

const publicProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: {
        type: String,
        enum: ['Residential', 'Commercial', 'Industrial', 'Infrastructure', 'Other'],
        default: 'Other'
    },
    image: { type: String, required: true }, // URL or path to image
    shortDescription: { type: String, required: true },
    location: { type: String, default: 'Wardha, Maharashtra' },
    status: {
        type: String,
        enum: ['Completed', 'Ongoing', 'Upcoming'],
        default: 'Completed'
    },
    mapLink: { type: String, default: '' },
    order: { type: Number, default: 0 } // for custom ordering
}, { timestamps: true });

module.exports = mongoose.model('PublicProject', publicProjectSchema);
