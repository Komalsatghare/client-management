const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
const fs = require('fs');
const uploadDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Define allowed origins
const allowedOrigins = [
  'https://stellular-alfajores-ee88ff.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.indexOf(origin) !== -1 || 
                     origin.endsWith('.netlify.app') || 
                     origin.endsWith('.render.com');

    if (!isAllowed) {
      console.warn(`CORS blocked for origin: ${origin}`);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images statically

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
