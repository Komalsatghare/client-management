const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// @route   POST /api/reviews
// @desc    Add or Update client review (Upsert)
// @access  Private (Client only)
router.post('/', verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'client' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only logged-in users can leave reviews' });
        }

        const { rating, comment } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({ message: 'Rating and comment are required' });
        }

        // Upsert logic: search by clientId
        const review = await Review.findOneAndUpdate(
            { clientId: req.user.id },
            {
                clientId: req.user.id,
                clientName: req.user.name || 'Anonymous Client',
                rating,
                comment,
                isDeleted: false // If it was previously soft-deleted, restore it
            },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({ message: 'Review saved successfully', review });
    } catch (error) {
        console.error('Review Save Error:', error);
        res.status(500).json({ message: 'Server error saving review' });
    }
});

// @route   GET /api/reviews/my-review
// @desc    Get the logged-in client's review
// @access  Private (Client only)
router.get('/my-review', verifyToken, async (req, res) => {
    try {
        const review = await Review.findOne({ clientId: req.user.id });
        res.json(review || null);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching review' });
    }
});

// @route   GET /api/reviews
// @desc    Get all active reviews (Public/Admin)
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({ isDeleted: false }).sort({ updatedAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching reviews' });
    }
});

// @route   DELETE /api/reviews/:id
// @desc    Soft delete or permanent delete a review
// @access  Private (Admin only)
router.delete('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting review' });
    }
});

module.exports = router;
