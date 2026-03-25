const express = require('express');
const User = require('../models/User');
const Character = require('../models/Character');
const NPC = require('../models/NPC');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// GET /api/players — list all players + NPC characters (for whisper target selector)
// Returns displayName = character name if set, otherwise username
router.get('/', requireAuth, async (req, res) => {
  try {
    const users = await User.find({}, 'username').lean();
    const characters = await Character.find({}, 'userId state.identity.name').lean();
    const charMap = {};
    characters.forEach(c => { charMap[String(c.userId)] = c.state?.identity?.name?.trim() || ''; });

    const playerList = users.map(u => ({
      userId: String(u._id),
      username: u.username,
      displayName: charMap[String(u._id)] || u.username,
      isNPC: false,
    }));

    const npcs = await NPC.find().sort({ name: 1 }).lean();
    const npcList = npcs.map(n => ({
      userId: 'npc:' + String(n._id),
      username: n.name,
      displayName: n.name,
      isNPC: true,
      color: n.color,
    }));

    res.json([...playerList, ...npcList]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
