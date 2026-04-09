const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { sendInquiryReplyEmail } = require('../utils/emailService');

// CREATE an inquiry (from homepage)
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, service, message } = req.body;

        // Basic validation
        if (!firstName || !lastName || !email || !phone || !service || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newInquiry = new Inquiry({
            firstName,
            lastName,
            email,
            phone,
            service,
            message
        });

        await newInquiry.save();
        res.status(201).json({ message: 'Inquiry submitted successfully!' });
    } catch (error) {
        console.error("Error saving inquiry:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// GET all inquiries (for Admin Dashboard)
router.get('/', async (req, res) => {
    try {
        // Optionally sort by newest first
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.status(200).json(inquiries);
    } catch (error) {
        console.error("Error fetching inquiries:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Optionally: DELETE an inquiry
router.delete('/:id', async (req, res) => {
    try {
        await Inquiry.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Inquiry deleted successfully.' });
    } catch (error) {
        console.error("Error deleting inquiry:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// REPLY to an inquiry (Admin) — saves reply in DB and sends email to submitter
router.put('/:id/reply', async (req, res) => {
    try {
        const { reply } = req.body;
        if (!reply) return res.status(400).json({ message: 'Reply text is required.' });

        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { reply, repliedAt: new Date(), status: 'Replied' },
            { new: true }
        );
        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });

        // Send email to the inquiry submitter (non-blocking — DB is already updated)
        try {
            await sendInquiryReplyEmail({
                toEmail:         inquiry.email,
                toName:          `${inquiry.firstName} ${inquiry.lastName}`,
                phone:           inquiry.phone,
                service:         inquiry.service,
                originalMessage: inquiry.message,
                replyText:       reply,
            });
            console.log(`Reply email sent to ${inquiry.email}`);
        } catch (emailErr) {
            // Log but don't fail the request — reply is already saved
            console.error('Email sending failed (reply still saved):', emailErr.message);
        }

        res.status(200).json({ message: 'Reply sent successfully.', inquiry });
    } catch (error) {
        console.error("Error replying to inquiry:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;

