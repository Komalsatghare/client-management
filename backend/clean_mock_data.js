const mongoose = require('mongoose');
require('dotenv').config();
const ProjectRequest = require('./models/ProjectRequest');

async function cleanMockData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Remove the mock ID "1234567890" from all requests
        const result = await ProjectRequest.updateMany(
            { zoomMeetingId: "1234567890" },
            { 
                $set: { 
                    zoomMeetingId: null,
                    zoomJoinUrl: null,
                    zoomStartUrl: null,
                    zoomPassword: null
                } 
            }
        );

        console.log(`Cleaned ${result.modifiedCount} project requests with mock data.`);
        process.exit(0);
    } catch (error) {
        console.error('Error cleaning data:', error);
        process.exit(1);
    }
}

cleanMockData();
