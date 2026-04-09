const mongoose = require('mongoose');

const projectRequestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: String, required: true },
    deadline: { type: String, required: true },
    fileUrl: { type: String },

    // Requirements filled at creation time
    requirements: { type: String },

    status: {
        type: String,
        enum: [
            'pending',
            'approved',
            'rejected',
            'meeting_requested',
            'meeting_scheduled',
            'completed'
        ],
        default: 'pending'
    },

    meetingRequestedBy: { 
        type: String, 
        enum: ['client', 'admin'], 
        default: 'client' 
    },

    adminMessage: { type: String },

    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },

    // Meeting fields (set by admin when scheduling)
    meetingDate: { type: String },
    meetingTime: { type: String },
    meetingLocation: { type: String },
    meetingMessage: { type: String },

    // Zoom meeting fields (populated when admin schedules via Zoom API)
    zoomMeetingId:  { type: String },
    zoomJoinUrl:    { type: String },
    zoomStartUrl:   { type: String },
    zoomPassword:   { type: String }

}, { timestamps: true });

module.exports = mongoose.model('ProjectRequest', projectRequestSchema);
