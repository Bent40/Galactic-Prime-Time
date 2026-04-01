const express = require('express');
const Character = require('../models/Character');
const User = require('../models/User');
const SkillTemplate = require('../models/SkillTemplate');
const Message = require('../models/Message');
const NPC = require('../models/NPC');
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

// POST /api/admin/players/bulk/achievements — grant the same achievement to multiple players
// NOTE: must come before /:userId routes to avoid param collision
router.post('/players/bulk/achievements', async (req, res) => {
  try {
    const { userIds, title, desc, reward } = req.body;
    if (!title) return res.status(400).json({ error: 'Achievement title required' });
    if (!Array.isArray(userIds) || userIds.length === 0)
      return res.status(400).json({ error: 'userIds array required' });

    const unlockedTemplates = await SkillTemplate.find({
      achievementUnlock: { $regex: new RegExp('^' + title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }
    }).lean();

    const results = [];
    for (const userId of userIds) {
      try {
        const character = await Character.findOne({ userId });
        if (!character) { results.push({ userId, ok: false, error: 'Character not found' }); continue; }
        const state = character.state || {};
        if (!state.achievements) state.achievements = [];
        const achievement = { id: Date.now() + Math.floor(Math.random() * 10000), title, desc: desc || '', reward: reward || '' };
        state.achievements.push(achievement);
        if (!state.skills) state.skills = [];
        const autoGranted = [];
        for (const t of unlockedTemplates) {
          if (!state.skills.some(s => s.name === t.name)) {
            state.skills.push({
              id: Date.now() + Math.floor(Math.random() * 10000),
              name: t.name, momentCost: t.momentCost || '', stats: t.stats || [],
              passive: !!t.passive, capacity: t.capacity || 5, level: 0,
              requirements: t.requirements || '', range: t.range || '',
              target: t.target || '', effect: t.effect || '',
              description: t.description || '', levelEffects: t.levelEffects || {},
              unlockedByAchievement: title,
            });
            autoGranted.push(t.name);
          }
        }
        await Character.findOneAndUpdate({ userId }, { state });
        results.push({ userId, ok: true, autoGrantedSkills: autoGranted });
      } catch (e) {
        results.push({ userId, ok: false, error: e.message });
      }
    }
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/players/bulk/objectives — send an objective to multiple players
// NOTE: must come before /:userId routes to avoid param collision
router.post('/players/bulk/objectives', async (req, res) => {
  try {
    const { userIds, section, title, type, description, status } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0)
      return res.status(400).json({ error: 'userIds array required' });
    if (!title) return res.status(400).json({ error: 'title required' });
    const sec = ['main', 'directives', 'goals'].includes(section) ? section : 'main';
    const results = [];
    for (const userId of userIds) {
      try {
        const character = await Character.findOne({ userId });
        if (!character) { results.push({ userId, ok: false, error: 'Character not found' }); continue; }
        const state = character.state || {};
        if (!state.objectives) state.objectives = { main: [], directives: [], goals: [] };
        if (!state.objectives[sec]) state.objectives[sec] = [];
        state.objectives[sec].push({
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          title, type: type || '', description: description || '',
          status: status || 'active', subtasks: [],
        });
        await Character.findOneAndUpdate({ userId }, { state });
        results.push({ userId, ok: true });
      } catch (e) {
        results.push({ userId, ok: false, error: e.message });
      }
    }
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/players/:userId/skills — add a skill to a player's character
router.post('/players/:userId/skills', async (req, res) => {
  try {
    const { name, momentCost, stats, passive, capacity, requirements, range, target, effect, description, levelEffects } = req.body;
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
      description: description || '',
      levelEffects: levelEffects || {},
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
    const { name, momentCost, stats, passive, capacity, requirements, range, target, effect, description, levelEffects } = req.body;
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
      levelEffects: levelEffects || {},
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
          levelEffects: t.levelEffects || {},
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

// PATCH /api/admin/players/:userId/tags — set tags array
router.patch('/players/:userId/tags', async (req, res) => {
  try {
    const { tags } = req.body;
    const character = await Character.findOne({ userId: req.params.userId });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const state = character.state || {};
    state.tags = Array.isArray(tags) ? tags : [];

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
    const { name, momentCost, stats, passive, capacity, requirements, range, target, effect, description, achievementUnlock, levelEffects } = req.body;
    if (!name) return res.status(400).json({ error: 'Skill name required' });
    const template = await SkillTemplate.create({ name, momentCost, stats, passive, capacity, requirements, range, target, effect, description, achievementUnlock, levelEffects: levelEffects || {} });
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/admin/skill-library/:id
router.put('/skill-library/:id', async (req, res) => {
  try {
    const { name, momentCost, stats, passive, capacity, requirements, range, target, effect, description, achievementUnlock, levelEffects } = req.body;
    if (!name) return res.status(400).json({ error: 'Skill name required' });
    const template = await SkillTemplate.findByIdAndUpdate(req.params.id, { name, momentCost, stats, passive, capacity, requirements, range, target, effect, description, achievementUnlock, levelEffects: levelEffects || {} }, { new: true });
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

// POST /api/admin/skill-library/bulk — import multiple templates at once
router.post('/skill-library/bulk', async (req, res) => {
  try {
    const { skills } = req.body;
    if (!Array.isArray(skills) || !skills.length) {
      return res.status(400).json({ error: 'skills array required' });
    }

    const results = { added: 0, skipped: 0, errors: [] };

    for (const s of skills) {
      if (!s.name || typeof s.name !== 'string' || !s.name.trim()) {
        results.errors.push({ name: s.name || '(unnamed)', reason: 'Missing name' });
        results.skipped++;
        continue;
      }
      try {
        await SkillTemplate.create({
          name:             s.name.trim(),
          momentCost:       s.momentCost   || '',
          stats:            Array.isArray(s.stats) ? s.stats : (s.stats ? [s.stats] : []),
          passive:          !!s.passive,
          capacity:         Number(s.capacity) || 5,
          requirements:     s.requirements  || '',
          range:            s.range         || '',
          target:           s.target        || '',
          effect:           s.effect        || '',
          description:       s.description        || '',
          achievementUnlock: s.achievementUnlock  || '',
          levelEffects:      (s.levelEffects && typeof s.levelEffects === 'object') ? s.levelEffects : {},
        });
        results.added++;
      } catch (e) {
        results.errors.push({ name: s.name, reason: e.message });
        results.skipped++;
      }
    }

    res.json({ ok: true, ...results });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
//  NPC CHARACTERS
// ============================================================

// GET /api/admin/npcs
router.get('/npcs', async (req, res) => {
  try {
    const npcs = await NPC.find().sort({ name: 1 }).lean();
    res.json(npcs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/npcs
router.post('/npcs', async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'NPC name required' });
    const npc = await NPC.create({ name: name.trim(), color: color || '#c8a84b' });
    res.status(201).json(npc);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/npcs/:id
router.delete('/npcs/:id', async (req, res) => {
  try {
    await NPC.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
//  COMMS — ADMIN MESSAGE ACCESS
// ============================================================

// GET /api/admin/messages — all messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(100).lean();
    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/messages — send as an NPC (or plain name fallback)
router.post('/messages', async (req, res) => {
  try {
    const { text, npcId, recipientId, recipientIsNpc, style: reqStyle } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Message text required' });
    if (text.length > 500) return res.status(400).json({ error: 'Message too long' });

    let senderName = 'Admin';
    let msgStyle = reqStyle || null;

    if (npcId) {
      const npc = await NPC.findById(npcId).lean();
      if (!npc) return res.status(404).json({ error: 'NPC not found' });
      senderName = npc.name;
      msgStyle = { color: npc.color, font: reqStyle?.font || 'default', effect: reqStyle?.effect || 'none' };
    }

    let recipientNPC = null;
    let recipientName = null;

    if (recipientIsNpc && recipientId) {
      const rNpc = await NPC.findById(recipientId).lean();
      if (!rNpc) return res.status(404).json({ error: 'Recipient NPC not found' });
      recipientNPC = rNpc._id;
      recipientName = rNpc.name;
    } else if (recipientId) {
      const rChar = await Character.findOne({ userId: recipientId }, 'state.identity.name').lean();
      const rUser = await User.findById(recipientId, 'username').lean();
      if (!rUser) return res.status(404).json({ error: 'Recipient not found' });
      recipientName = rChar?.state?.identity?.name?.trim() || rUser.username;
    }

    const msg = await Message.create({
      sender: req.userId,
      senderName,
      recipient: (!recipientIsNpc && recipientId) ? recipientId : null,
      recipientNPC,
      recipientName,
      style: msgStyle,
      text: text.trim(),
    });
    res.status(201).json(msg);
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
