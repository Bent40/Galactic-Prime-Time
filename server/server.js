const path = require('path');
// Explicit path: the start command runs from the repo root (`node server/server.js`),
// so a bare config() would look for ./.env at the root and silently find nothing.
// Every seed script already does it this way.
require('dotenv').config({ path: path.join(__dirname, '.env') });
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
const tagsRoutes = require('./routes/tags');
const boxesRoutes = require('./routes/boxes');
const tablesRoutes = require('./routes/tables');

const app = express();
// Last MongoDB error, surfaced by /api/health. Declared here because the health
// route reads it and the connect logic writes it.
let lastDbError = null;
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);

// ── Health check ──────────────────────────────────────────────────────────────
// Render polls this (healthCheckPath in render.yaml). It ALWAYS answers 200 once
// the process is up, and reports the database separately: a paused Atlas cluster
// should show as a degraded service that still serves the client and says why,
// not as a boot failure that restarts forever.
const DB_STATE = ['disconnected', 'connected', 'connecting', 'disconnecting'];
app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  db: DB_STATE[mongoose.connection.readyState] || 'unknown',
  dbError: lastDbError || undefined,
  uptime: Math.round(process.uptime()),
}));

// ── The API needs the database; the client does not ───────────────────────────
// Without this, every request queues on mongoose's command buffer and dies of a
// timeout ~10s later with a 500. A 503 that names the cause is far more useful.
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next();
  res.status(503).json({ error: 'Database unavailable — the server is up but cannot reach MongoDB.' });
});

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
app.use('/api/tags', tagsRoutes);
app.use('/api/boxes', boxesRoutes);
app.use('/api/tables', tablesRoutes);

// Serve React client in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ── Boot ──────────────────────────────────────────────────────────────────────
// 🔴 THIS USED TO LISTEN ONLY *AFTER* MONGO CONNECTED, AND process.exit(1) ON
// FAILURE. That is what Render reported as "failed to boot": any unreachable
// Atlas — a paused free cluster, an IP allowlist that does not include Render's
// dynamic egress, a rotated password — meant the process died having never
// opened a port, so Render saw no port and emailed.
//
// Now: LISTEN FIRST, connect in the background, and never exit on a database
// error. The service boots, passes its health check, serves the client, answers
// /api with a 503 that names the cause, and keeps retrying.
const server = app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
  logger.info(`Log level: ${process.env.LOG_LEVEL || 'http'}`);
  if (!process.env.MONGODB_URI) {
    logger.warn('MONGODB_URI is not set — falling back to localhost. On a deploy this is almost certainly wrong.');
  }
});

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/galactic-prime-time';
let retryDelay = 2000;

function connectMongo() {
  mongoose.connect(MONGO_URI, {
    // Fail fast and retry, rather than hanging the first request for 30 seconds.
    serverSelectionTimeoutMS: 8000,
  })
    .then(() => {
      lastDbError = null;
      retryDelay = 2000;
      logger.info('MongoDB connected');
    })
    .catch(err => {
      lastDbError = err.message;
      logger.error(`MongoDB connection failed: ${err.message} — retrying in ${retryDelay / 1000}s`);
      setTimeout(connectMongo, retryDelay);
      retryDelay = Math.min(retryDelay * 2, 60000);   // capped backoff
    });
}
connectMongo();

mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
mongoose.connection.on('reconnected', () => { lastDbError = null; logger.info('MongoDB reconnected'); });
mongoose.connection.on('error', err => { lastDbError = err.message; });

// Render sends SIGTERM when it shuts an instance down; close cleanly so the last
// requests finish instead of being cut off mid-flight.
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => {
    logger.info(`${sig} received — shutting down`);
    server.close(() => mongoose.connection.close(false).then(() => process.exit(0)));
    setTimeout(() => process.exit(0), 10000).unref();
  });
}
