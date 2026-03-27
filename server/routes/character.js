const express = require('express');
const Character = require('../models/Character');
const SkillTemplate = require('../models/SkillTemplate');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// GET /api/character — load character for the logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const character = await Character.findOne({ userId: req.userId });
    if (!character) return res.status(404).json({ error: 'No character found' });
    res.json({ state: character.state, updatedAt: character.updatedAt });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/character — save (upsert) character for the logged-in user
router.post('/', requireAuth, async (req, res) => {
  try {
    const { state } = req.body;
    if (!state) return res.status(400).json({ error: 'No state provided' });

    const character = await Character.findOneAndUpdate(
      { userId: req.userId },
      { state },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ ok: true, updatedAt: character.updatedAt });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/character/skills — skill library for player autocomplete
router.get('/skills', requireAuth, async (req, res) => {
  try {
    const templates = await SkillTemplate.find(
      {},
      'name momentCost stats capacity requirements range target effect description levelEffects'
    ).sort({ name: 1 }).lean();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
