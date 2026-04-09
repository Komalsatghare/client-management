const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// GET all approved feedback (public — for homepage display)
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ approved: true }).sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new feedback (public — from homepage form)
router.post('/', async (req, res) => {
    try {
        const { name, rating, message } = req.body;
        if (!name || !rating || !message) {
            return res.status(400).json({ error: 'Name, rating, and message are required.' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
        }
        const feedback = new Feedback({ name, rating: Number(rating), message });
        await feedback.save();
        res.status(201).json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all feedback including unapproved (admin only — for moderation)
router.get('/admin/all', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH toggle approved status (admin moderation)
router.patch('/:id/toggle', async (req, res) => {
    try {
        const fb = await Feedback.findById(req.params.id);
        if (!fb) return res.status(404).json({ error: 'Feedback not found' });
        fb.approved = !fb.approved;
        await fb.save();
        res.json(fb);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE feedback (admin)
router.delete('/:id', async (req, res) => {
    try {
        await Feedback.findByIdAndDelete(req.params.id);
        res.json({ message: 'Feedback deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
