const express = require('express');
const MomentTracker = require('../models/MomentTracker');
const requireAuth  = require('../middleware/auth');
const requireAdmin = require('../middleware/adminAuth');

const router = express.Router();

// Helper — get or create the singleton tracker doc
async function getTracker() {
  let tracker = await MomentTracker.findOne();
  if (!tracker) tracker = await MomentTracker.create({});
  return tracker;
}

// ── GET /api/tracker ─────────────────────────────────────────
// Any authenticated user can read the tracker
router.get('/', requireAuth, async (req, res) => {
  try {
    const tracker = await getTracker();
    res.json(tracker);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── PATCH /api/tracker/advance ───────────────────────────────
// Advance moment by 1; if it was 10 → reset to 0 and increment clock
router.patch('/advance', requireAdmin, async (req, res) => {
  try {
    const tracker = await getTracker();
    if (tracker.currentMoment >= 10) {
      tracker.currentMoment = 0;
      tracker.clock += 1;
    } else {
      tracker.currentMoment += 1;
    }
    await tracker.save();
    res.json(tracker);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── PATCH /api/tracker/retreat ───────────────────────────────
// Step moment back by 1
router.patch('/retreat', requireAdmin, async (req, res) => {
  try {
    const tracker = await getTracker();
    if (tracker.currentMoment > 0) tracker.currentMoment -= 1;
    await tracker.save();
    res.json(tracker);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── PATCH /api/tracker/set-moment ────────────────────────────
// Jump to a specific moment (0-10)
router.patch('/set-moment', requireAdmin, async (req, res) => {
  try {
    const { moment } = req.body;
    const m = parseInt(moment);
    if (isNaN(m) || m < 0 || m > 10) return res.status(400).json({ error: 'moment must be 0–10' });
    const tracker = await getTracker();
    tracker.currentMoment = m;
    await tracker.save();
    res.json(tracker);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── POST /api/tracker/entries ────────────────────────────────
// Add a player or mob entry
router.post('/entries', requireAdmin, async (req, res) => {
  try {
    const { name, type, moment, color, userId } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const m = parseInt(moment) || 0;
    if (m < 0 || m > 10) return res.status(400).json({ error: 'moment must be 0–10' });

    const tracker = await getTracker();
    const entry = {
      entryId: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name,
      type:   type === 'player' ? 'player' : 'mob',
      moment: m,
      color:  color || (type === 'player' ? '#00d4ff' : '#ff2255'),
      userId: userId || '',
    };
    tracker.entries.push(entry);
    await tracker.save();
    res.json(tracker);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── PATCH /api/tracker/entries/:entryId ──────────────────────
// Move an entry to a different moment (drag-and-drop save)
router.patch('/entries/:entryId', requireAdmin, async (req, res) => {
  try {
    const { moment } = req.body;
    const m = parseInt(moment);
    if (isNaN(m) || m < 0 || m > 10) return res.status(400).json({ error: 'moment must be 0–10' });

    const tracker = await getTracker();
    const entry = tracker.entries.find(e => e.entryId === req.params.entryId);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });

    entry.moment = m;
    tracker.markModified('entries');
    await tracker.save();
    res.json(tracker);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── DELETE /api/tracker/entries/:entryId ─────────────────────
router.delete('/entries/:entryId', requireAdmin, async (req, res) => {
  try {
    const tracker = await getTracker();
    const before = tracker.entries.length;
    tracker.entries = tracker.entries.filter(e => e.entryId !== req.params.entryId);
    if (tracker.entries.length === before) return res.status(404).json({ error: 'Entry not found' });
    tracker.markModified('entries');
    await tracker.save();
    res.json(tracker);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── DELETE /api/tracker/entries ──────────────────────────────
// Clear all entries
router.delete('/entries', requireAdmin, async (req, res) => {
  try {
    const tracker = await getTracker();
    tracker.entries = [];
    await tracker.save();
    res.json(tracker);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── POST /api/tracker/reset ──────────────────────────────────
// Reset moment to 0 and clock to 0, keep entries
router.post('/reset', requireAdmin, async (req, res) => {
  try {
    const tracker = await getTracker();
    tracker.currentMoment = 0;
    tracker.clock = 0;
    await tracker.save();
    res.json(tracker);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
