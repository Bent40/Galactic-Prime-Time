const express      = require('express');
const Tag          = require('../models/Tag');
const requireAuth  = require('../middleware/auth');
const requireAdmin = require('../middleware/adminAuth');
const logger       = require('../logger');

const router = express.Router();

// ── GET /api/tags ────────────────────────────────────────────────────────────
// Any authenticated user may read the tag catalog (used by the player picker).
router.get('/', requireAuth, async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 }).lean();
    res.json(tags);
  } catch (err) {
    logger.error('GET /api/tags failed', { message: err.message, stack: err.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

// ── POST /api/tags ───────────────────────────────────────────────────────────
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, description, effect, conditions } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });

    const tag = await Tag.create({
      name,
      description: description || '',
      effect: effect || '',
      conditions: conditions || '',
    });
    logger.info(`TAG CREATE  "${name}"`);
    res.json(tag);
  } catch (err) {
    logger.error('POST /api/tags failed', { message: err.message, stack: err.stack });
    res.status(500).json({ error: err.name === 'ValidationError' ? err.message : 'Server error' });
  }
});

// ── PATCH /api/tags/:id ──────────────────────────────────────────────────────
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, description, effect, conditions } = req.body;
    const update = {};
    if (name !== undefined) {
      if (!name) return res.status(400).json({ error: 'name required' });
      update.name = name;
    }
    if (description !== undefined) update.description = description;
    if (effect !== undefined)      update.effect = effect;
    if (conditions !== undefined)  update.conditions = conditions;

    const tag = await Tag.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!tag) return res.status(404).json({ error: 'Tag not found' });
    res.json(tag);
  } catch (err) {
    logger.error('PATCH /api/tags/:id failed', { id: req.params.id, message: err.message, stack: err.stack });
    res.status(500).json({ error: err.name === 'ValidationError' ? err.message : 'Server error' });
  }
});

// ── DELETE /api/tags/:id ─────────────────────────────────────────────────────
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) return res.status(404).json({ error: 'Tag not found' });
    res.json({ ok: true });
  } catch (err) {
    logger.error('DELETE /api/tags/:id failed', { id: req.params.id, message: err.message, stack: err.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
