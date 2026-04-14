const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const Project = require('../models/Project');
const multer = require('multer');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Configure multer for form-data parsing
const upload = multer();

router.post('/', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();

    // If a project name was provided during client creation, auto-create a Project entry
    if (req.body.project) {
        try {
            await Project.create({
                name: req.body.project,
                clientId: client._id,
                status: 'Pending',
                notes: req.body.notes || ""
            });
        } catch (projErr) {
            console.error("Auto-project creation failed:", projErr.message);
            // We don't fail the whole request because the client WAS created successfully
        }
    }

    return res.status(201).json(client);

  } catch (err) {
    console.error("Client creation error:", err);

    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }

    if (err.code === 11000) {
      return res.status(409).json({
        error: "Email or Username already exists"
      });
    }

    return res.status(500).json({
      error: err.message || "Server error"
    });
  }
});


router.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a client
router.put('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a client
router.delete('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get projects for a specific client
router.get('/:id/projects', async (req, res) => {
  try {
    const Project = require('../models/Project');
    const projects = await Project.find({ clientId: req.params.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get notifications for a specific client
router.get('/:id/notifications', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).select('notifications');
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    // Return newest first
    const sorted = client.notifications.sort((a, b) => b.createdAt - a.createdAt);
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark all notifications as read for a client
router.put('/:id/notifications/mark-read', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    client.notifications.forEach(n => n.read = true);
    await client.save();

    res.json({ message: 'Notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
