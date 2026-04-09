const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();
const ProjectRequest = require('../models/ProjectRequest');

async function testEndToEndZoom() {
    await mongoose.connect(process.env.MONGO_URI);
    
    // 1. Find a pending request
    const request = await ProjectRequest.findOne({ status: 'pending' });
    if (!request) {
        console.error('No pending project request found to test with.');
        process.exit(1);
    }

    console.log(`Testing with Request: ${request.title} (${request._id})`);

    // 2. Simulate the 'Schedule' + 'Zoom Sync' flow
    // In the real app, the frontend calls schedule-meeting THEN create-meeting.
    
    const testDate = '2026-05-10';
    const testTime = '14:30';

    try {
        console.log('Step 1: Creating Zoom Meeting...');
        const zoomRes = await axios.post('http://localhost:5000/api/zoom/create-meeting', {
            requestId: request._id,
            topic: `Test Meeting: ${request.title}`,
            startTime: new Date(`${testDate}T${testTime}:00`).toISOString(),
            agenda: 'End-to-end integration test.'
        });

        console.log('SUCCESS: Zoom Meeting Created!');
        console.log('Meeting ID:', zoomRes.data.meetingId);
        console.log('Join URL:', zoomRes.data.joinUrl);

        // 3. Verify Database Persistence
        const updatedRequest = await ProjectRequest.findById(request._id);
        if (updatedRequest.zoomJoinUrl && updatedRequest.zoomMeetingId) {
            console.log('VERIFIED: Database updated with Zoom details.');
        } else {
            console.log('FAILURE: Database was not updated.');
        }

    } catch (error) {
        console.error('TEST FAILED:', error.response?.data || error.message);
    } finally {
        mongoose.connection.close();
    }
}

testEndToEndZoom();
