const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const { storage } = require('../config/cloudinary');

const upload = multer({ storage: storage });

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/projects/my-projects (Client-specific)
router.get('/my-projects', verifyToken, async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'client') {
            return res.status(403).json({ message: "Access denied." });
        }
        const projects = await Project.find({ clientId: req.user.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error("My Projects Fetch Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get single project
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new project with images
router.post('/', verifyToken, authorizeRoles('admin'), upload.array('images', 20), async (req, res) => { // Limit increased to 20
    try {
        const { name, clientId, status, startDate, endDate, deadline, budget, paymentDetails, services, notes, locationLink } = req.body;

        let imageUrls = [];
        if (req.files) {
            imageUrls = req.files.map(file => file.path); // Use Cloudinary secure URL
        }

        let parsedServices = [];
        if (services) {
            try {
                parsedServices = JSON.parse(services);
            } catch (e) {
                console.error("Error parsing services:", e);
                parsedServices = [];
            }
        }

        const project = new Project({
            name,
            clientId: clientId || null,
            status,
            startDate,
            endDate,
            deadline,
            budget,
            paymentDetails,
            services: parsedServices,
            notes,
            locationLink,
            images: imageUrls
        });

        await project.save();

        // Optional: If client assigned, notify them
        if (clientId) {
            const Client = require('../models/Client');
            await Client.findByIdAndUpdate(clientId, {
                $push: {
                    notifications: {
                        message: `An Admin has assigned a new project to you: ${name}`
                    }
                }
            });
        }

        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update project
router.put('/:id', verifyToken, authorizeRoles('admin'), upload.array('images', 20), async (req, res) => { // Limit increased to 20
    try {
        const { 
            name, clientId, status, startDate, endDate, deadline, 
            budget, paymentDetails, services, notes, existingImages,
            totalBudget, totalPaid, remainingAmount, locationLink 
        } = req.body;

        let newImageUrls = [];
        if (req.files) {
            newImageUrls = req.files.map(file => file.path); // Cloudinary URL
        }

        // Combine existing images (if any) with new ones. existingImages might be a string or array depending on frontend
        let finalImages = [];
        if (existingImages) {
            finalImages = Array.isArray(existingImages) ? existingImages : [existingImages];
        }
        finalImages = [...finalImages, ...newImageUrls];

        let parsedServices = [];
        if (services) {
            try {
                parsedServices = JSON.parse(services);
            } catch (e) {
                console.error("Error parsing services:", e);
                parsedServices = [];
            }
        }

        // Helper to safely parse strings to numbers (removing currency, commas, etc)
        const safeParseNumber = (val) => {
            if (typeof val === 'number') return val;
            if (!val) return 0;
            const clean = val.toString().replace(/[^0-9.]/g, '');
            const num = parseFloat(clean);
            return isNaN(num) ? 0 : num;
        };

        const updateData = {
            name,
            clientId: clientId || null,
            status,
            startDate,
            endDate,
            deadline,
            budget,
            paymentDetails,
            services: parsedServices,
            notes,
            images: finalImages,
            totalBudget: safeParseNumber(totalBudget || budget),
            totalPaid: safeParseNumber(totalPaid),
            remainingAmount: safeParseNumber(remainingAmount),
            locationLink
        };

        const project = await Project.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
        if (!project) return res.status(404).json({ error: 'Project not found' });

        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete project
router.delete('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Progress Milestone with images
router.put('/:id/progress', verifyToken, authorizeRoles('admin'), upload.array('images', 10), async (req, res) => {
    try {
        const { title, description, status } = req.body;
        
        let imageUrls = [];
        if (req.files) {
            imageUrls = req.files.map(file => file.path); // Cloudinary URL
        }

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    progress: { title, description, status, images: imageUrls }
                }
            },
            { returnDocument: 'after' }
        );

        if (!project) return res.status(404).json({ error: 'Project not found' });

        // Optional: Notify the client about progress update
        if (project.clientId) {
            const Client = require('../models/Client');
            await Client.findByIdAndUpdate(project.clientId, {
                $push: {
                    notifications: {
                        message: `Project update on "${project.name}": ${title}`
                    }
                }
            });
        }

        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an existing milestone
router.put('/:id/progress/:msId', verifyToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, "progress._id": req.params.msId },
            {
                $set: {
                    "progress.$.title": title,
                    "progress.$.description": description,
                    "progress.$.status": status
                }
            },
            { returnDocument: 'after' }
        );

        if (!project) return res.status(404).json({ error: 'Project or Milestone not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an existing milestone
router.delete('/:id/progress/:msId', verifyToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { progress: { _id: req.params.msId } }
            },
            { returnDocument: 'after' }
        );

        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
