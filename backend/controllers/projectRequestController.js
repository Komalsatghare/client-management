const ProjectRequest = require('../models/ProjectRequest');
const Project = require('../models/Project');

// @desc    Create a new project request (with requirements)
// @route   POST /api/project-requests
// @access  Private (Client only)
const createRequest = async (req, res) => {
    try {
        const { title, description, budget, deadline, requirements } = req.body;
        const clientId = req.user.id;

        if (!title || !description || !budget || !deadline) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        let fileUrl = req.body.fileUrl; // Fallback to provided URL
        if (req.file) {
            fileUrl = `/uploads/${req.file.filename}`;
        }

        const projectRequest = await ProjectRequest.create({
            title, description, budget, deadline, fileUrl, requirements, clientId
        });

        res.status(201).json({ message: 'Project request submitted successfully', projectRequest });
    } catch (error) {
        console.error('Create Request Error:', error);
        res.status(500).json({ message: 'Server error creating project request' });
    }
};

// @desc    Get all project requests for the logged-in client
// @route   GET /api/project-requests/my-requests
// @access  Private (Client only)
const getClientRequests = async (req, res) => {
    try {
        const clientId = req.user.id;
        const requests = await ProjectRequest.find({ clientId }).sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        console.error('Get Client Requests Error:', error);
        res.status(500).json({ message: 'Server error fetching your requests' });
    }
};

// @desc    Get all project requests (Admin only)
// @route   GET /api/project-requests
// @access  Private (Admin only)
const getAllRequests = async (req, res) => {
    try {
        const requests = await ProjectRequest.find()
            .populate('clientId', 'name email phone')
            .sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        console.error('Get All Requests Error:', error);
        res.status(500).json({ message: 'Server error fetching all requests' });
    }
};

// @desc    Update project request status (Approve / Reject)
// @route   PUT /api/project-requests/:id/status
// @access  Private (Admin only)
const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminMessage } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const projectRequest = await ProjectRequest.findById(id);
        if (!projectRequest) return res.status(404).json({ message: 'Project request not found' });

        projectRequest.status = status;
        if (adminMessage !== undefined) projectRequest.adminMessage = adminMessage;

        const updatedRequest = await projectRequest.save();

        if (status === 'approved') {
            try {
                await Project.create({
                    name: projectRequest.title,
                    description: projectRequest.description,
                    clientId: projectRequest.clientId,
                    status: 'Active',
                    budget: projectRequest.budget,
                    startDate: new Date(),
                    endDate: new Date(projectRequest.deadline)
                });
            } catch (projectError) {
                console.error('Auto-create project failed:', projectError);
            }
        }

        res.status(200).json({ message: `Project request ${status} successfully`, projectRequest: updatedRequest });
    } catch (error) {
        console.error('Update Request Status Error:', error);
        res.status(500).json({ message: 'Server error updating request status' });
    }
};

// @desc    Client requests a meeting (available after approval)
// @route   PUT /api/project-requests/:id/request-meeting
// @access  Private (Client only)
const requestMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const clientId = req.user.id;

        const projectRequest = await ProjectRequest.findOne({ _id: id, clientId });
        if (!projectRequest) return res.status(404).json({ message: 'Project request not found' });

        if (!['approved', 'completed', 'meeting_scheduled'].includes(projectRequest.status)) {
            return res.status(400).json({ message: 'Meeting request can be sent after approval or a previous meeting' });
        }

        projectRequest.status = 'meeting_requested';
        projectRequest.meetingRequestedBy = 'client';
        await projectRequest.save();

        res.status(200).json({ message: 'Meeting requested successfully', projectRequest });
    } catch (error) {
        console.error('Request Meeting Error:', error);
        res.status(500).json({ message: 'Server error requesting meeting' });
    }
};

// @desc    Admin requests another meeting with client
// @route   PUT /api/project-requests/:id/admin-request-meeting
// @access  Private (Admin only)
const adminRequestMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const projectRequest = await ProjectRequest.findById(id);
        if (!projectRequest) return res.status(404).json({ message: 'Project request not found' });

        if (!['approved', 'completed', 'meeting_scheduled', 'meeting_requested'].includes(projectRequest.status)) {
            return res.status(400).json({ message: 'Meeting request is not allowed for current status' });
        }

        projectRequest.status = 'meeting_requested';
        projectRequest.meetingRequestedBy = 'admin';
        if (req.body && typeof req.body.adminMessage === 'string') {
            projectRequest.adminMessage = req.body.adminMessage;
        }
        await projectRequest.save();

        res.status(200).json({ message: 'Admin requested a new meeting', projectRequest });
    } catch (error) {
        console.error('Admin Request Meeting Error:', error);
        res.status(500).json({ message: 'Server error requesting meeting by admin' });
    }
};

// @desc    Admin schedules (or updates) the meeting
// @route   PUT /api/project-requests/:id/schedule-meeting
// @access  Private (Admin only)
const scheduleMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const { meetingDate, meetingTime, meetingLocation, meetingMessage } = req.body;

        if (!meetingDate || !meetingTime || !meetingLocation) {
            return res.status(400).json({ message: 'Date, time and location are required' });
        }

        const projectRequest = await ProjectRequest.findById(id);
        if (!projectRequest) return res.status(404).json({ message: 'Project request not found' });

        if (!['meeting_requested', 'meeting_scheduled', 'approved', 'completed'].includes(projectRequest.status)) {
            return res.status(400).json({ message: 'Invalid status for scheduling' });
        }

        projectRequest.meetingDate = meetingDate;
        projectRequest.meetingTime = meetingTime;
        projectRequest.meetingLocation = meetingLocation;
        projectRequest.meetingMessage = meetingMessage || '';
        projectRequest.status = 'meeting_scheduled';

        await projectRequest.save();

        res.status(200).json({ message: 'Meeting scheduled successfully', projectRequest });
    } catch (error) {
        console.error('Schedule Meeting Error:', error);
        res.status(500).json({ message: 'Server error scheduling meeting' });
    }
};

// @desc    Client deletes their own project request
// @route   DELETE /api/project-requests/:id/my-request
// @access  Private (Client only)
const deleteOwnRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const clientId = req.user.id;

        const projectRequest = await ProjectRequest.findOne({ _id: id, clientId });
        if (!projectRequest) return res.status(404).json({ message: 'Project request not found' });

        await ProjectRequest.findByIdAndDelete(id);
        res.status(200).json({ message: 'Project request deleted successfully' });
    } catch (error) {
        console.error('Delete Own Request Error:', error);
        res.status(500).json({ message: 'Server error deleting request' });
    }
};

// @desc    Admin marks meeting as completed
// @route   PUT /api/project-requests/:id/complete
// @access  Private (Admin only)
const completeMeeting = async (req, res) => {
    try {
        const { id } = req.params;

        const projectRequest = await ProjectRequest.findById(id);
        if (!projectRequest) return res.status(404).json({ message: 'Project request not found' });

        if (projectRequest.status !== 'meeting_scheduled') {
            return res.status(400).json({ message: 'Only scheduled meetings can be marked as done' });
        }

        projectRequest.status = 'completed';
        await projectRequest.save();

        res.status(200).json({ message: 'Meeting marked as completed', projectRequest });
    } catch (error) {
        console.error('Complete Meeting Error:', error);
        res.status(500).json({ message: 'Server error completing meeting' });
    }
};

// @desc    Delete a project request (Admin only)
// @route   DELETE /api/project-requests/:id
// @access  Private (Admin only)
const deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const projectRequest = await ProjectRequest.findById(id);

        if (!projectRequest) return res.status(404).json({ message: 'Project request not found' });

        await ProjectRequest.findByIdAndDelete(id);
        res.status(200).json({ message: 'Project request deleted successfully' });
    } catch (error) {
        console.error('Delete Request Error:', error);
        res.status(500).json({ message: 'Server error deleting request' });
    }
};

module.exports = {
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
};
