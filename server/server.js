require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const characterRoutes = require('./routes/character');
const adminRoutes = require('./routes/admin');
const messagesRoutes = require('./routes/messages');
const playersRoutes = require('./routes/players');
const trackerRoutes = require('./routes/momentTracker');
const itemsRoutes = require('./routes/items');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve HTML pages
const rootDir = path.join(__dirname, '..');
app.get('/character-sheet', (req, res) => res.sendFile(path.join(rootDir, 'character-sheet.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(rootDir, 'admin.html')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/items', itemsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
