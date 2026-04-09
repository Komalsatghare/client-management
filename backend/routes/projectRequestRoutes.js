const express = require('express');
const router = express.Router();

const {
    createRequest,
    getClientRequests,
    getAllRequests,
    updateRequestStatus,
    requestMeeting,
    adminRequestMeeting,
    scheduleMeeting,
    completeMeeting,
    deleteRequest,
    deleteOwnRequest
} = require('../controllers/projectRequestController');

const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// ==========================================
// CLIENT ROUTES
// ==========================================

// Create a new request (Client only)
router.post('/', verifyToken, authorizeRoles('client'), createRequest);

// Get my requests (Client only)
router.get('/my-requests', verifyToken, authorizeRoles('client'), getClientRequests);

// Request a meeting after approval (Client only)
router.put('/:id/request-meeting', verifyToken, authorizeRoles('client'), requestMeeting);

// Client deletes their own request
router.delete('/:id/my-request', verifyToken, authorizeRoles('client'), deleteOwnRequest);

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get ALL requests (Admin only)
router.get('/', verifyToken, authorizeRoles('admin'), getAllRequests);

// Approve or Reject (Admin only)
router.put('/:id/status', verifyToken, authorizeRoles('admin'), updateRequestStatus);

// Schedule OR update meeting (Admin only)
router.put('/:id/schedule-meeting', verifyToken, authorizeRoles('admin'), scheduleMeeting);

// Admin can request/re-request meeting
router.put('/:id/admin-request-meeting', verifyToken, authorizeRoles('admin'), adminRequestMeeting);

// Mark meeting as completed (Admin only)
router.put('/:id/complete', verifyToken, authorizeRoles('admin'), completeMeeting);

// Delete a project request (Admin only)
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteRequest);

module.exports = router;
