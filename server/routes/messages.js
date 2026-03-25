const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const Character = require('../models/Character');
const NPC = require('../models/NPC');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// GET /api/messages — fetch recent messages visible to this user
router.get('/', requireAuth, async (req, res) => {
  try {
    const uid = req.userId;
    const messages = await Message.find({
      $or: [
        { recipient: null, recipientNPC: null },     // broadcasts
        { recipient: uid },                           // whispers to me (user)
        { sender: uid, recipient: { $ne: null } },   // my outgoing user whispers
        { sender: uid, recipientNPC: { $ne: null } }, // my outgoing NPC whispers
      ]
    }).sort({ createdAt: -1 }).limit(60).lean();
    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/messages — send a message
router.post('/', requireAuth, async (req, res) => {
  try {
    const { text, recipientId, recipientNpcId, style } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Message text required' });
    if (text.length > 500) return res.status(400).json({ error: 'Message too long (max 500 chars)' });

    const sender = await User.findById(req.userId, 'username').lean();
    if (!sender) return res.status(401).json({ error: 'User not found' });

    // Use character name if set, fall back to username
    const senderChar = await Character.findOne({ userId: req.userId }, 'state.identity.name').lean();
    const senderName = senderChar?.state?.identity?.name?.trim() || sender.username;

    let recipient = null;
    let recipientNPC = null;
    let recipientName = null;

    if (recipientNpcId) {
      // Whisper to an NPC character
      const npc = await NPC.findById(recipientNpcId).lean();
      if (!npc) return res.status(404).json({ error: 'NPC not found' });
      recipientNPC = npc._id;
      recipientName = npc.name;
    } else if (recipientId) {
      // Whisper to a real player
      const recipChar = await Character.findOne({ userId: recipientId }, 'state.identity.name').lean();
      const recipUser = await User.findById(recipientId, 'username').lean();
      if (!recipUser) return res.status(404).json({ error: 'Recipient not found' });
      recipient = recipientId;
      recipientName = recipChar?.state?.identity?.name?.trim() || recipUser.username;
    }

    // Sanitise style — only allow known values
    const ALLOWED_EFFECTS = ['none', 'jitter', 'glow', 'rainbow', 'flicker', 'shake'];
    const ALLOWED_FONTS   = ['default', 'mono', 'serif', 'bold', 'alien'];
    const safeStyle = {
      color:  (style?.color  && /^#[0-9a-fA-F]{3,8}$/.test(style.color)) ? style.color : null,
      font:   ALLOWED_FONTS.includes(style?.font)   ? style.font   : 'default',
      effect: ALLOWED_EFFECTS.includes(style?.effect) ? style.effect : 'none',
    };

    const msg = await Message.create({
      sender: req.userId,
      senderName,
      recipient,
      recipientNPC,
      recipientName,
      style: safeStyle,
      text: text.trim(),
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
