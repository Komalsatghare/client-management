const express = require('express');
const router = express.Router();
const PublicProject = require('../models/PublicProject');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'public-project-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Only images are allowed'));
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ROUTES (No auth required)
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/public-projects — Fetch all showcase projects (public)
router.get('/', async (req, res) => {
    try {
        const projects = await PublicProject.find().sort({ order: 1, createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/public-projects/:id — Get single project (public)
router.get('/:id', async (req, res) => {
    try {
        const project = await PublicProject.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN-ONLY ROUTES (Auth required + role = admin)
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/public-projects — Add new showcase project (admin only)
router.post('/', verifyToken, authorizeRoles('admin'), upload.single('imageFile'), async (req, res) => {
    try {
        const { title, category, image, shortDescription, location, status, mapLink, order } = req.body;
        
        // If a file was uploaded, use its path. Otherwise fallback to the 'image' URL field.
        const finalImage = req.file ? `/uploads/${req.file.filename}` : image;

        const project = new PublicProject({
            title, category, image: finalImage, shortDescription, location, status, mapLink, order
        });
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/public-projects/:id — Edit showcase project (admin only)
router.put('/:id', verifyToken, authorizeRoles('admin'), upload.single('imageFile'), async (req, res) => {
    try {
        const { title, category, image, shortDescription, location, status, mapLink, order } = req.body;
        
        const updateData = { title, category, shortDescription, location, status, mapLink, order };
        
        // Update image only if a new file is uploaded or a new URL is provided
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        } else if (image) {
            updateData.image = image;
        }

        const project = await PublicProject.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/public-projects/:id — Delete showcase project (admin only)
router.delete('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const project = await PublicProject.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
