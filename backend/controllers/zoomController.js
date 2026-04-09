const axios = require('axios');
const crypto = require('crypto');
const ProjectRequest = require('../models/ProjectRequest');

const ZOOM_BASE_URL = 'https://api-us.zoom.us/v2';

/* ─────────────────────────────────────────
   Helper: Get Server-to-Server OAuth token
───────────────────────────────────────── */
async function getZoomAccessToken() {
    const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;

    if (!ZOOM_ACCOUNT_ID || !ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET) {
        throw new Error('Zoom credentials not configured in .env');
    }

    // Check for a manual debug token first (useful if automatic generation fails due to app activation state)
    if (process.env.ZOOM_DEBUG_TOKEN) {
        console.log('Using manual Zoom Debug Token from .env');
        return process.env.ZOOM_DEBUG_TOKEN;
    }

    const credentials = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');

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

    return response.data.access_token;
}

/* ─────────────────────────────────────────
   Helper: Generate Meeting SDK Signature
   (allows browser to join meeting via SDK)
───────────────────────────────────────── */
function generateSDKSignature(meetingNumber, role) {
    const { ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;
    const timestamp = Math.round(new Date().getTime() / 1000) - 30;
    const msg = Buffer.from(ZOOM_CLIENT_ID + meetingNumber + timestamp + role).toString('base64');
    const hash = crypto.createHmac('sha256', ZOOM_CLIENT_SECRET).update(msg).digest('base64');
    const signature = Buffer.from(`${ZOOM_CLIENT_ID}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');
    return signature;
}

/**
 * Clean Meeting ID — remove any formatting (dashes or spaces) 
 * so it's a numeric string only. 
 */
function cleanMeetingId(id) {
    if (!id) return id;
    return String(id).replace(/[-\s]/g, '');
}

/**
 * Verify Meeting exists on Zoom before rendering join page
 * Requires granular scope: meeting:read:meeting:admin
 */
async function verifyMeetingExists(meetingId, accessToken) {
    try {
        const cleanId = cleanMeetingId(meetingId);
        const { data } = await axios.get(`${ZOOM_BASE_URL}/meetings/${cleanId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return { valid: true, data };
    } catch (error) {
        console.error('Zoom API Verification Error:', error.response?.data?.message || error.message);
        return { valid: false, message: error.response?.data?.message || error.message };
    }
}

/* ─────────────────────────────────────────
   POST /api/zoom/create-meeting
   Admin creates a Zoom meeting for a project request
───────────────────────────────────────── */
const createMeeting = async (req, res) => {
    try {
        const { requestId, topic, startTime, agenda } = req.body;

        if (!requestId || !topic || !startTime) {
            return res.status(400).json({ message: 'requestId, topic, and startTime are required' });
        }

        const accessToken = await getZoomAccessToken();

        const meetingPayload = {
            topic: topic || 'Project Discussion Meeting',
            type: 2,                  // Scheduled meeting
            start_time: startTime,    // ISO 8601 e.g. "2024-04-01T10:00:00Z"
            duration: 40,             // 40 minutes
            timezone: 'Asia/Kolkata',
            agenda: agenda || '',
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
                mute_upon_entry: false,
                waiting_room: false,
                audio: 'voip',
                auto_recording: 'none'
            }
        };

        const { data: meeting } = await axios.post(
            `${ZOOM_BASE_URL}/users/me/meetings`,
            meetingPayload,
            { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
        );

        const cleanId = cleanMeetingId(meeting.id);

        // Save Zoom details to the project request
        const projectRequest = await ProjectRequest.findById(requestId);
        if (!projectRequest) return res.status(404).json({ message: 'Project request not found' });

        projectRequest.zoomMeetingId = cleanId;
        projectRequest.zoomJoinUrl   = meeting.join_url;
        projectRequest.zoomStartUrl  = meeting.start_url;
        projectRequest.zoomPassword  = meeting.password;
        await projectRequest.save();

        res.status(200).json({
            meetingId:   cleanId,
            joinUrl:     meeting.join_url,
            startUrl:    meeting.start_url,
            password:    meeting.password,
            topic:       meeting.topic,
            startTime:   meeting.start_time,
            duration:    meeting.duration
        });

    } catch (error) {
        console.error('Create Zoom Meeting Error:', error.response?.data || error.message);
        
        // REFINED MOCK FALLBACK: Inform the user instead of saving an invalid numeric ID
        if (error.response?.status === 400 || error.response?.status === 403 || error.response?.status === 500) {
            console.log('Zoom API Restricted. Reporting configuration error...');
            
            return res.status(200).json({
                message: 'Draft Meeting (Zoom API not linked)',
                topic: req.body.topic || "Project Discussion",
                startTime: req.body.startTime,
                duration: 40,
                isMock: true,
                warning: "Your Server-to-Server OAuth app is either not activated or missing scopes (meeting:write:meeting:admin)."
            });
        }

        res.status(500).json({
            message: 'Failed to create Zoom meeting',
            detail: error.response?.data?.message || error.message
        });
    }
};

/* ─────────────────────────────────────────
   POST /api/zoom/signature
   Generate Meeting SDK signature for joining
───────────────────────────────────────── */
const getSignature = async (req, res) => {
    try {
        const { meetingNumber, role } = req.body;

        if (!meetingNumber) {
            return res.status(400).json({ message: 'meetingNumber is required' });
        }

        const numericRole = parseInt(role, 10) || 0;  // 0 = participant, 1 = host
        const signature = generateSDKSignature(meetingNumber, numericRole);

        res.status(200).json({
            signature,
            sdkKey: process.env.ZOOM_CLIENT_ID
        });

    } catch (error) {
        console.error('Signature Error:', error.message);
        res.status(500).json({ message: 'Failed to generate signature', detail: error.message });
    }
};

/* ─────────────────────────────────────────
   GET /api/zoom/join/:requestId
   Renders the EJS join page with App/Browser buttons
   Bypasses browser "OS not supported" by direct URI
───────────────────────────────────────── */
const getJoinPage = async (req, res) => {
    try {
        const { requestId } = req.params;
        const projectRequest = await ProjectRequest.findById(requestId).populate('clientId');
        
        if (!projectRequest || !projectRequest.zoomMeetingId) {
            return res.status(404).send('<h1>Meeting not found</h1><p>Ensure the admin has scheduled a Zoom meeting for this request.</p>');
        }

        const accessToken = await getZoomAccessToken();
        const meetingId = cleanMeetingId(projectRequest.zoomMeetingId);

        // Check for UUID vs Numeric meeting ID as requested
        if (meetingId.length > 15 || /[a-zA-Z]/.test(meetingId)) {
             return res.status(400).send(`
                <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #e11d48;">⚠️ Meeting ID Format Error</h1>
                    <p style="color: #64748b; font-size: 16px;">The stored ID (<strong>${meetingId}</strong>) appears to be a UUID or Zoom link instead of the numeric ID.</p>
                    <p>Please use the numeric Meeting ID (e.g., 812 3456 7890) without dashes or spaces.</p>
                </div>
            `);
        }
        
        // Active Verification from Zoom API as requested
        const { valid, message } = await verifyMeetingExists(meetingId, accessToken);
        if (!valid) {
            return res.status(404).send(`
                <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #e11d48;">⚠️ Invalid Meeting ID</h1>
                    <p style="color: #64748b; font-size: 16px;">Zoom says: <strong>${message}</strong></p>
                    <p style="margin-top: 20px;">The meeting has either expired or been deleted. Please ask the admin to resync the meeting.</p>
                </div>
            `);
        }

        const password  = projectRequest.zoomPassword;
        const userName  = projectRequest.clientId?.name || 'Guest User';
        const topic     = projectRequest.title || 'Project Discussion';

        // 1. Zoom App Protocol URI (Windows Desktop)
        // zoommtg://zoom.us/join?confno={id}&pwd={pwd}&uname={name}
        const appLink = `zoommtg://zoom.us/join?confno=${meetingId}&pwd=${password}&uname=${encodeURIComponent(userName)}`;

        // 2. Zoom Web Client URI (Browser Fallback)
        // https://app.zoom.us/wc/join/{id}?pwd={pwd}&un={name}
        const browserLink = `https://app.zoom.us/wc/join/${meetingId}?pwd=${password}&un=${encodeURIComponent(userName)}`;

        res.render('zoom-join', {
            meetingId,
            password,
            userName,
            topic,
            appLink,
            browserLink,
            brandName: 'Dhanvij Builders'
        });

    } catch (error) {
        console.error('Join Page Error:', error.message);
        res.status(500).send('<h1>Server Error</h1><p>' + error.message + '</p>');
    }
};

module.exports = { createMeeting, getSignature, getJoinPage };
