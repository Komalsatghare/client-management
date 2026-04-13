const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

app.use(cors());
app.use(express.json()); // 🔥 REQUIRED
app.use(express.urlencoded({ extended: true }));

const seedDefaultAdminIfNeeded = require('./utils/seedDefaultAdmin');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected Successfully!");
    console.log("Connected Database Name:", mongoose.connection.name);
    await seedDefaultAdminIfNeeded();
  })
  .catch(err => console.error("MongoDB Connection Error:", err));

const clientRoutes = require('./routes/clients');
const projectRoutes = require('./routes/projects'); // Project Routes
const authRoutes = require('./routes/authRoutes'); // Restored Unified Gateway Router
const adminRoutes = require('./routes/adminRoutes');
const clientAuthRoutes = require('./routes/clientAuthRoutes');
const projectRequestRoutes = require('./routes/projectRequestRoutes');
const paymentRoutes = require('./routes/payments');
const inquiryRoutes = require('./routes/inquiries');
const zoomRoutes = require('./routes/zoomRoutes');
const publicProjectRoutes = require('./routes/publicProjects');
const feedbackRoutes = require('./routes/feedback');
const agreementRoutes = require('./routes/agreementRoutes');

app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/public-projects', publicProjectRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth', authRoutes); // Exposes unified login check
app.use('/api/admin', adminRoutes);
app.use('/api/client', clientAuthRoutes); // Changed to /api/client
app.use('/api/project-requests', projectRequestRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/zoom', zoomRoutes);
app.use('/api/agreements', agreementRoutes);
app.use('/uploads', express.static('uploads')); // Serve uploaded images statically

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
