const express = require('express');
const Enemy = require('../models/Enemy');
const requireAdmin = require('../middleware/adminAuth');

const router = express.Router();
router.use(requireAdmin);

router.get('/', async (req, res) => {
  try {
    const enemies = await Enemy.find().sort({ name: 1 }).lean();
    res.json(enemies);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', async (req, res) => {
  try {
    const { name, tier, color, description, notes, bodyParts } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const enemy = await Enemy.create({
      name, tier: tier || 'mob',
      color: color || '#ff2255',
      description: description || '', notes: notes || '',
      bodyParts: Array.isArray(bodyParts) ? bodyParts : [],
    });
    res.json(enemy);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, tier, color, description, notes, bodyParts } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const enemy = await Enemy.findByIdAndUpdate(
      req.params.id,
      { name, tier, color, description, notes, bodyParts: Array.isArray(bodyParts) ? bodyParts : [] },
      { new: true }
    );
    if (!enemy) return res.status(404).json({ error: 'Not found' });
    res.json(enemy);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Enemy.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
