/**
 * smsService.js
 * 
 * Standard utility for sending SMS notifications.
 * Currently implemented as a mock that logs to the console.
 * To use real SMS, integrate Twilio or a similar provider here.
 */

exports.sendSMS = async (to, message) => {
    try {
        console.log(`[SMS MOCK] To: ${to} | Message: ${message}`);
        
        // Example Twilio integration placeholder:
        /*
        const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });
        */

        return { success: true, provider: 'mock' };
    } catch (error) {
        console.error("SMS Service Error:", error.message);
        return { success: false, error: error.message };
    }
};
