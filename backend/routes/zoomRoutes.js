const express = require('express');
const router  = express.Router();
const { createMeeting, getSignature } = require('../controllers/zoomController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Admin creates a Zoom meeting for a project request
router.post('/create-meeting', verifyToken, authorizeRoles('admin'), createMeeting);

// Both admin and client can request a signature to join via SDK
router.post('/signature', verifyToken, getSignature);

// Landing page for joining either via Zoom App or Browser
const { getJoinPage } = require('../controllers/zoomController');
router.get('/join/:requestId', getJoinPage);

module.exports = router;
