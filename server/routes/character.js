const express = require('express');
const Character = require('../models/Character');
const SkillTemplate = require('../models/SkillTemplate');
const requireAuth = require('../middleware/auth');
const { enrichSkills, normalizeSkills, normalizeTraits } = require('../utils/skillUtils');

const router = express.Router();

// GET /api/character — load character for the logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const character = await Character.findOne({ userId: req.userId });
    if (!character) return res.status(404).json({ error: 'No character found' });

    const state = character.state || {};
    const enrichedSkills = await enrichSkills(state.skills || []);
    res.json({ state: { ...state, skills: enrichedSkills }, updatedAt: character.updatedAt });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/character — save (upsert) character for the logged-in user
router.post('/', requireAuth, async (req, res) => {
  try {
    const { state } = req.body;
    if (!state) return res.status(400).json({ error: 'No state provided' });

    const normalizedState = {
      ...state,
      skills: normalizeSkills(state.skills || []),
      traits: normalizeTraits(state.traits, state.traitBonus, state.traitLevelBonus),
    };
    delete normalizedState.traitBonus;
    delete normalizedState.traitLevelBonus;

    const character = await Character.findOneAndUpdate(
      { userId: req.userId },
      { state: normalizedState },
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
      'name momentCost stats passive capacity requirements range target effect description keywords levelEffects'
    ).sort({ name: 1 }).lean();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
