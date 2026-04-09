const express = require('express');
const router = express.Router();
const PublicProject = require('../models/PublicProject');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

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
router.post('/', verifyToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { title, category, image, shortDescription, location, status, mapLink, order } = req.body;
        const project = new PublicProject({
            title, category, image, shortDescription, location, status, mapLink, order
        });
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/public-projects/:id — Edit showcase project (admin only)
router.put('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const { title, category, image, shortDescription, location, status, mapLink, order } = req.body;
        const project = await PublicProject.findByIdAndUpdate(
            req.params.id,
            { title, category, image, shortDescription, location, status, mapLink, order },
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
