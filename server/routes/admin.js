const express = require('express');
const Character = require('../models/Character');
const User = require('../models/User');
const SkillTemplate = require('../models/SkillTemplate');
const requireAdmin = require('../middleware/adminAuth');

const router = express.Router();

// All routes require admin
router.use(requireAdmin);

// GET /api/admin/players — list all users with character summary
router.get('/players', async (req, res) => {
  try {
    const users = await User.find({}, 'username isAdmin createdAt').lean();
    const characters = await Character.find({}, 'userId state updatedAt').lean();
    const charMap = {};
    characters.forEach(c => { charMap[String(c.userId)] = c; });

    const players = users.map(u => {
      const char = charMap[String(u._id)];
      return {
        userId: u._id,
        username: u.username,
        isAdmin: u.isAdmin,
        createdAt: u.createdAt,
        hasCharacter: !!char,
        characterName: char ? (char.state?.identity?.name || '') : '',
        level: char ? (char.state?.identity?.level || 1) : 1,
        updatedAt: char ? char.updatedAt : null,
      };
    });

    res.json(players);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/players/:userId — get full character state for a player
router.get('/players/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, 'username isAdmin').lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const character = await Character.findOne({ userId: req.params.userId }).lean();
    res.json({ user, state: character ? character.state : null, updatedAt: character ? character.updatedAt : null });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/admin/players/:userId/state — fully replace character state
router.put('/players/:userId/state', async (req, res) => {
  try {
    const { state } = req.body;
    if (!state) return res.status(400).json({ error: 'No state provided' });

    const character = await Character.findOneAndUpdate(
      { userId: req.params.userId },
      { state },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ ok: true, updatedAt: character.updatedAt });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/players/:userId/skills — add a skill to a player's character
router.post('/players/:userId/skills', async (req, res) => {
  try {
    const { name, momentCost, stats, passive, capacity, requirements, range, target, effect, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Skill name required' });

    const character = await Character.findOne({ userId: req.params.userId });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const state = character.state || {};
    if (!state.skills) state.skills = [];

    const skill = {
      id: Date.now(),
      name,
      momentCost: momentCost || '',
      stats: stats || [],
      passive: !!passive,
      capacity: capacity || 5,
      level: 0,
      requirements: requirements || '',
      range: range || '',
      target: target || '',
      effect: effect || '',
      description: description || ''
    };
    state.skills.push(skill);

    await Character.findOneAndUpdate({ userId: req.params.userId }, { state });
    res.json({ ok: true, skill });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/admin/players/:userId/skills/:skillId — edit a skill
router.put('/players/:userId/skills/:skillId', async (req, res) => {
  try {
    const { name, momentCost, stats, passive, capacity, requirements, range, target, effect, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Skill name required' });

    const character = await Character.findOne({ userId: req.params.userId });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const state = character.state || {};
    if (!state.skills) return res.status(404).json({ error: 'Skill not found' });

    const id = Number(req.params.skillId);
    const idx = state.skills.findIndex(s => s.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Skill not found' });

    state.skills[idx] = {
      ...state.skills[idx],
      name,
      momentCost: momentCost || '',
      stats: stats || [],
      passive: !!passive,
      capacity: capacity || 5,
      requirements: requirements || '',
      range: range || '',
      target: target || '',
      effect: effect || '',
      description: description || '',
    };

    await Character.findOneAndUpdate({ userId: req.params.userId }, { state });
    res.json({ ok: true, skill: state.skills[idx] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/players/:userId/skills/:skillId — remove a skill
router.delete('/players/:userId/skills/:skillId', async (req, res) => {
  try {
    const character = await Character.findOne({ userId: req.params.userId });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const state = character.state || {};
    if (!state.skills) return res.status(404).json({ error: 'Skill not found' });

    const id = Number(req.params.skillId);
    const idx = state.skills.findIndex(s => s.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Skill not found' });

    state.skills.splice(idx, 1);
    await Character.findOneAndUpdate({ userId: req.params.userId }, { state });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/players/:userId/achievements — grant an achievement
router.post('/players/:userId/achievements', async (req, res) => {
  try {
    const { title, desc, reward } = req.body;
    if (!title) return res.status(400).json({ error: 'Achievement title required' });

    const character = await Character.findOne({ userId: req.params.userId });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const state = character.state || {};
    if (!state.achievements) state.achievements = [];

    const achievement = { id: Date.now(), title, desc: desc || '', reward: reward || '' };
    state.achievements.push(achievement);

    // Auto-grant skills locked behind this achievement
    const unlockedTemplates = await SkillTemplate.find({
      achievementUnlock: { $regex: new RegExp('^' + title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }
    }).lean();

    const autoGranted = [];
    if (!state.skills) state.skills = [];
    for (const t of unlockedTemplates) {
      const alreadyHas = state.skills.some(s => s.name === t.name);
      if (!alreadyHas) {
        const skill = {
          id: Date.now() + Math.floor(Math.random() * 10000),
          name: t.name,
          momentCost: t.momentCost || '',
          stats: t.stats || [],
          passive: !!t.passive,
          capacity: t.capacity || 5,
          level: 0,
          requirements: t.requirements || '',
          range: t.range || '',
          target: t.target || '',
          effect: t.effect || '',
          description: t.description || '',
          unlockedByAchievement: title,
        };
        state.skills.push(skill);
        autoGranted.push(skill);
      }
    }

    await Character.findOneAndUpdate({ userId: req.params.userId }, { state });
    res.json({ ok: true, achievement, autoGrantedSkills: autoGranted });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/players/:userId/achievements/:achievementId — revoke an achievement
router.delete('/players/:userId/achievements/:achievementId', async (req, res) => {
  try {
    const character = await Character.findOne({ userId: req.params.userId });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const state = character.state || {};
    if (!state.achievements) return res.status(404).json({ error: 'Achievement not found' });

    const id = Number(req.params.achievementId);
    const idx = state.achievements.findIndex(a => a.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Achievement not found' });

    state.achievements.splice(idx, 1);
    await Character.findOneAndUpdate({ userId: req.params.userId }, { state });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/players/:userId/traits — set trait values
router.patch('/players/:userId/traits', async (req, res) => {
  try {
    const { traitBonus, traits } = req.body;
    const character = await Character.findOne({ userId: req.params.userId });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const state = character.state || {};
    if (traitBonus) state.traitBonus = { ...state.traitBonus, ...traitBonus };
    if (traits) state.traits = { ...state.traits, ...traits };

    await Character.findOneAndUpdate({ userId: req.params.userId }, { state });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/players/:userId/identity — update identity fields
router.patch('/players/:userId/identity', async (req, res) => {
  try {
    const character = await Character.findOne({ userId: req.params.userId });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const state = character.state || {};
    if (!state.identity) state.identity = {};
    Object.assign(state.identity, req.body);

    await Character.findOneAndUpdate({ userId: req.params.userId }, { state });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/players/:userId/tokens — adjust tokens
router.patch('/players/:userId/tokens', async (req, res) => {
  try {
    const character = await Character.findOne({ userId: req.params.userId });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const state = character.state || {};
    if (!state.tokens) state.tokens = { narrative: 0, upgrade: 0, bossTokens: [] };
    Object.assign(state.tokens, req.body);

    await Character.findOneAndUpdate({ userId: req.params.userId }, { state });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
//  SKILL LIBRARY
// ============================================================

// GET /api/admin/skill-library
router.get('/skill-library', async (req, res) => {
  try {
    const templates = await SkillTemplate.find().sort({ name: 1 }).lean();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/skill-library
router.post('/skill-library', async (req, res) => {
  try {
    const { name, momentCost, stats, passive, capacity, requirements, range, target, effect, description, achievementUnlock } = req.body;
    if (!name) return res.status(400).json({ error: 'Skill name required' });
    const template = await SkillTemplate.create({ name, momentCost, stats, passive, capacity, requirements, range, target, effect, description, achievementUnlock });
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/admin/skill-library/:id
router.put('/skill-library/:id', async (req, res) => {
  try {
    const { name, momentCost, stats, passive, capacity, requirements, range, target, effect, description, achievementUnlock } = req.body;
    if (!name) return res.status(400).json({ error: 'Skill name required' });
    const template = await SkillTemplate.findByIdAndUpdate(req.params.id, { name, momentCost, stats, passive, capacity, requirements, range, target, effect, description, achievementUnlock }, { new: true });
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/skill-library/:id
router.delete('/skill-library/:id', async (req, res) => {
  try {
    const template = await SkillTemplate.findByIdAndDelete(req.params.id);
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
//  ALL ACHIEVEMENTS (aggregated)
// ============================================================

// GET /api/admin/achievements
router.get('/achievements', async (req, res) => {
  try {
    const users = await User.find({}, 'username').lean();
    const characters = await Character.find({}, 'userId state').lean();
    const userMap = {};
    users.forEach(u => { userMap[String(u._id)] = u.username; });

    const rows = [];
    characters.forEach(c => {
      const achievements = c.state?.achievements || [];
      const username = userMap[String(c.userId)] || 'unknown';
      const charName = c.state?.identity?.name || '';
      achievements.forEach(a => {
        rows.push({ userId: c.userId, username, charName, ...a });
      });
    });

    rows.sort((a, b) => b.id - a.id); // newest first
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
