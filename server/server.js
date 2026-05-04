require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const logger = require('./logger');
const requestLogger = require('./middleware/requestLogger');

const authRoutes = require('./routes/auth');
const characterRoutes = require('./routes/character');
const adminRoutes = require('./routes/admin');
const messagesRoutes = require('./routes/messages');
const playersRoutes = require('./routes/players');
const trackerRoutes = require('./routes/momentTracker');
const itemsRoutes = require('./routes/items');
const enemiesRoutes = require('./routes/enemies');
const affixesRoutes = require('./routes/affixes');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/enemies', enemiesRoutes);
app.use('/api/affixes', affixesRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Serve React client in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time')
  .then(() => {
    logger.info('MongoDB connected');
    app.listen(PORT, () => {
      logger.info(`Server listening on http://localhost:${PORT}`);
      logger.info(`Log level: ${process.env.LOG_LEVEL || 'http'}`);
    });
  })
  .catch(err => {
    logger.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  });
