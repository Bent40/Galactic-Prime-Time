const express = require('express');
const Character = require('../models/Character');
const User = require('../models/User');
const SkillTemplate = require('../models/SkillTemplate');
const Message = require('../models/Message');
const NPC = require('../models/NPC');
const requireAdmin = require('../middleware/adminAuth');
const logger = require('../logger');
const { enrichSkills } = require('../utils/skillUtils');

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
    let state = character ? character.state : null;
    if (state && state.skills) {
      state = { ...state, skills: await enrichSkills(state.skills) };
    }
    res.json({ user, state, updatedAt: character ? character.updatedAt : null });
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

// PATCH /api/admin/players/bulk/followers — set followers for multiple players
// NOTE: must come before /:userId routes to avoid param collision
router.patch('/players/bulk/followers', async (req, res) => {
  try {
    const { userIds, followers } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0)
      return res.status(400).json({ error: 'userIds array required' });
    if (followers === undefined) return res.status(400).json({ error: 'followers required' });
    const results = [];
    for (const userId of userIds) {
      try {
        const character = await Character.findOne({ userId });
        if (!character) { results.push({ userId, ok: false, error: 'Not found' }); continue; }
        const state = character.state || {};
        if (!state.exposure) state.exposure = {};
        state.exposure.followers = followers;
        await Character.findOneAndUpdate({ userId }, { state });
        results.push({ userId, ok: true });
      } catch (e) { results.push({ userId, ok: false, error: e.message }); }
    }
    const ok = results.filter(r => r.ok).length;
    logger.info(`BULK FOLLOWERS  "${followers}"  → ${ok}/${userIds.length} players`);
    res.json({ results });
  } catch (err) {
    logger.error('PATCH /players/bulk/followers failed', { message: err.message, stack: err.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/players/:userId/exposure — set exposure fields (followers, viewers)
router.patch('/players/:userId/exposure', async (req, res) => {
  try {
    const character = await Character.findOne({ userId: req.params.userId });
    if (!character) return res.status(404).json({ error: 'Character not found' });
    const state = character.state || {};
    if (!state.exposure) state.exposure = {};
    Object.assign(state.exposure, req.body);
    await Character.findOneAndUpdate({ userId: req.params.userId }, { state });
    res.json({ ok: true });
  } catch (err) {
    logger.error('PATCH /players/:userId/exposure failed', { message: err.message, stack: err.stack });
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
          const alreadyHas = state.skills.some(s =>
            (s.templateId && String(s.templateId) === String(t._id)) ||
            (!s.templateId && s.name === t.name)
          );
          if (!alreadyHas) {
            state.skills.push({
              id: Date.now() + Math.floor(Math.random() * 10000),
              templateId: String(t._id),
              level: 0,
              capacity: t.capacity || 5,
              cooldownRemaining: 0,
              traitCosts: [],
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
    const okCount = results.filter(r => r.ok).length;
    logger.info(`BULK ACHIEVEMENT  "${title}"  → ${okCount}/${userIds.length} players`);
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
    const okCount = results.filter(r => r.ok).length;
    logger.info(`BULK OBJECTIVE  "${title}"  [${sec}]  → ${okCount}/${userIds.length} players`);
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/players/:userId/skills — add a skill to a player's character
router.post('/players/:userId/skills', async (req, res) => {
  try {
    const { templateId, name, momentCost, stats, passive, capacity, requirements, range, target, effect, description, levelEffects } = req.body;

    const character = await Character.findOne({ userId: req.params.userId });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const state = character.state || {};
    if (!state.skills) state.skills = [];

    let skill;
    if (templateId) {
      const tpl = await SkillTemplate.findById(templateId).lean();
      if (!tpl) return res.status(404).json({ error: 'Skill template not found' });
      skill = {
        id: Date.now(),
        templateId: String(tpl._id),
        level: 0,
        capacity: tpl.capacity || 5,
        cooldownRemaining: 0,
        traitCosts: [],
      };
    } else {
      if (!name) return res.status(400).json({ error: 'Skill name or templateId required' });
      // Legacy manual skill without a template reference
      skill = {
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
        traitCosts: [],
      };
    }

    state.skills.push(skill);
    await Character.findOneAndUpdate({ userId: req.params.userId }, { state });

    // Return enriched skill so client can display it immediately
    const [enrichedSkill] = await enrichSkills([skill]);
    res.json({ ok: true, skill: enrichedSkill });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/admin/players/:userId/skills/:skillId — update instance fields only
router.put('/players/:userId/skills/:skillId', async (req, res) => {
  try {
    const { level, capacity } = req.body;

    const character = await Character.findOne({ userId: req.params.userId });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const state = character.state || {};
    if (!state.skills) return res.status(404).json({ error: 'Skill not found' });

    const id = Number(req.params.skillId);
    const idx = state.skills.findIndex(s => s.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Skill not found' });

    if (level !== undefined) state.skills[idx].level = Math.max(0, Number(level));
    if (capacity !== undefined) state.skills[idx].capacity = Number(capacity);

    await Character.findOneAndUpdate({ userId: req.params.userId }, { state });
    const [enrichedSkill] = await enrichSkills([state.skills[idx]]);
    res.json({ ok: true, skill: enrichedSkill });
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
      const alreadyHas = state.skills.some(s =>
        (s.templateId && String(s.templateId) === String(t._id)) ||
        (!s.templateId && s.name === t.name)
      );
      if (!alreadyHas) {
        state.skills.push({
          id: Date.now() + Math.floor(Math.random() * 10000),
          templateId: String(t._id),
          level: 0,
          capacity: t.capacity || 5,
          cooldownRemaining: 0,
          traitCosts: [],
        });
        autoGranted.push(t.name);
      }
    }

    await Character.findOneAndUpdate({ userId: req.params.userId }, { state });
    logger.info(`ACHIEVEMENT GRANT  "${title}"  → player ${req.params.userId}${autoGranted.length ? `  (auto-skills: ${autoGranted.join(', ')})` : ''}`);
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

// POST /api/admin/players/:userId/levelup — grant one level-up point to the shared pool
router.post('/players/:userId/levelup', async (req, res) => {
  try {
    const character = await Character.findOne({ userId: req.params.userId });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const state = character.state || {};
    if (!state.levelPoints) state.levelPoints = { pool: 0 };
    state.levelPoints.pool = (state.levelPoints.pool || 0) + 1;

    await Character.findOneAndUpdate({ userId: req.params.userId }, { state });
    res.json({ ok: true, levelPoints: state.levelPoints });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/players/:userId/traits — set trait values (consolidated format)
router.patch('/players/:userId/traits', async (req, res) => {
  try {
    const { traits } = req.body;
    const character = await Character.findOne({ userId: req.params.userId });
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const state = character.state ? { ...character.state } : {};
    if (traits) {
      const currentTraits = state.traits || {};
      for (const [t, updates] of Object.entries(traits)) {
        currentTraits[t] = { ...(currentTraits[t] || {}), ...updates };
      }
      state.traits = currentTraits;
    }
    // Remove legacy flat fields if present
    delete state.traitBonus;
    delete state.traitLevelBonus;

    character.state = state;
    character.markModified('state');
    await character.save();
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
