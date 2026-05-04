const express    = require('express');
const Affix      = require('../models/Affix');
const requireAuth  = require('../middleware/auth');
const requireAdmin = require('../middleware/adminAuth');
const logger     = require('../logger');

const router = express.Router();

const TYPES = ['prefix', 'suffix'];
const TIERS = ['Lesser', 'Normal', 'Higher', 'Legendary', 'Mythic', 'Godly'];

// ── GET /api/affixes ─────────────────────────────────────────────────────────
// Any authenticated user may read the affix library (needed for the item picker)
router.get('/', requireAuth, async (req, res) => {
  try {
    const affixes = await Affix.find().sort({ type: 1, tier: 1, name: 1 }).lean();
    res.json(affixes);
  } catch (err) {
    logger.error('GET /api/affixes failed', { message: err.message, stack: err.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

// ── POST /api/affixes ────────────────────────────────────────────────────────
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, type, tier, effects, description } = req.body;
    if (!name)              return res.status(400).json({ error: 'name required' });
    if (!TYPES.includes(type)) return res.status(400).json({ error: 'type must be prefix or suffix' });
    if (tier && !TIERS.includes(tier)) return res.status(400).json({ error: 'invalid tier' });

    const affix = await Affix.create({ name, type, tier: tier || 'Normal', effects: effects || '', description: description || '' });
    logger.info(`AFFIX CREATE  "${name}"  [${type}] [${tier}]`);
    res.json(affix);
  } catch (err) {
    logger.error('POST /api/affixes failed', { message: err.message, stack: err.stack });
    res.status(500).json({ error: err.name === 'ValidationError' ? err.message : 'Server error' });
  }
});

// ── PUT /api/affixes/:id ─────────────────────────────────────────────────────
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, type, tier, effects, description } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    if (!TYPES.includes(type)) return res.status(400).json({ error: 'type must be prefix or suffix' });
    if (tier && !TIERS.includes(tier)) return res.status(400).json({ error: 'invalid tier' });

    const affix = await Affix.findByIdAndUpdate(
      req.params.id,
      { name, type, tier: tier || 'Normal', effects: effects || '', description: description || '' },
      { new: true, runValidators: true }
    );
    if (!affix) return res.status(404).json({ error: 'Affix not found' });
    res.json(affix);
  } catch (err) {
    logger.error('PUT /api/affixes/:id failed', { id: req.params.id, message: err.message, stack: err.stack });
    res.status(500).json({ error: err.name === 'ValidationError' ? err.message : 'Server error' });
  }
});

// ── DELETE /api/affixes/:id ──────────────────────────────────────────────────
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const affix = await Affix.findByIdAndDelete(req.params.id);
    if (!affix) return res.status(404).json({ error: 'Affix not found' });
    res.json({ ok: true });
  } catch (err) {
    logger.error('DELETE /api/affixes/:id failed', { id: req.params.id, message: err.message, stack: err.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
