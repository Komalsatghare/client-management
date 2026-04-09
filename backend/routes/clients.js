const express = require('express');
const router = express.Router();
const Client = require('../models/Client'); // 👈 VERY IMPORTANT
const multer = require('multer');

// Configure multer for form-data parsing
const upload = multer();

router.post('/', async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    return res.status(201).json(client);

  } catch (err) {

    if (err.code === 11000) {
      return res.status(409).json({
        error: "Email already exists"
      });
    }

    return res.status(500).json({
      error: "Server error"
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
