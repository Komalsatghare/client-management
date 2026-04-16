const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
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
  'https://dhanvij-builders.online',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.indexOf(origin) !== -1 || 
                     origin.endsWith('.netlify.app') || 
                     origin.endsWith('.render.com') ||
                     origin === 'https://dhanvij-builders.online' ||
                     origin === 'https://www.dhanvij-builders.online' ||
                     origin.endsWith('.dhanvij-builders.online');

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
const reviewRoutes = require('./routes/reviewRoutes');

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
app.use('/api/reviews', reviewRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images statically


// Global Error Handler (Crucial for Multer/Middleware errors)
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  
  // Handle Multer errors specifically
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File is too large. Max limit is 10MB.' });
  }
  
  if (err.message === 'Invalid file type') {
    return res.status(400).json({ message: 'Invalid file type. Only PDF, Word Documents, and Images are allowed.' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store participants per room: { roomId: [ { socketId, name, role } ] }
const roomParticipants = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-room', ({ roomId, name, role }) => {
    socket.join(roomId);
    
    if (!roomParticipants[roomId]) {
      roomParticipants[roomId] = [];
    }
    
    // Add participant if not already there (by socket id)
    if (!roomParticipants[roomId].find(p => p.socketId === socket.id)) {
      roomParticipants[roomId].push({ socketId: socket.id, name, role });
    }
    
    console.log(`${name} joined room: ${roomId}`);
    io.to(roomId).emit('update-participants', roomParticipants[roomId]);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Remove participant from all rooms they were in
    for (const roomId in roomParticipants) {
      const initialCount = roomParticipants[roomId].length;
      roomParticipants[roomId] = roomParticipants[roomId].filter(p => p.socketId !== socket.id);
      
      if (roomParticipants[roomId].length !== initialCount) {
        io.to(roomId).emit('update-participants', roomParticipants[roomId]);
      }
      
      // Clean up empty rooms
      if (roomParticipants[roomId].length === 0) {
        delete roomParticipants[roomId];
      }
    }
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
