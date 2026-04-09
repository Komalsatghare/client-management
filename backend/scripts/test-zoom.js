const axios = require('axios');
require('dotenv').config();

async function testZoom() {
    const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;

    const credentials = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');

    console.log('--- Zoom Diagnostic Test ---');
    console.log('Account ID:', ZOOM_ACCOUNT_ID);
    console.log('Client ID:', ZOOM_CLIENT_ID);
    console.log('----------------------------');

    try {
        const response = await axios.post(
            `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
            null,
            {
                headers: {
                    Authorization: `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        console.log('SUCCESS: Token retrieved!');
        console.log('Access Token (first 10 chars):', response.data.access_token.substring(0, 10) + '...');
    } catch (error) {
        console.error('FAILURE: Zoom API rejected the request.');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
        
        console.log('\n--- RECOMMENDED ACTIONS ---');
        console.log('1. Go to https://marketplace.zoom.us/');
        console.log('2. Manage -> Your App -> Choose your Server-to-Server OAuth App.');
        console.log('3. Ensure the app is "Activated" in the "Activation" tab.');
        console.log('4. Verify that Client ID and Client Secret in .env match the "App Credentials" tab.');
        console.log('5. Ensure "Account ID" matches the one shown in the Zoom App Credentials tab.');
    }
}

testZoom();
