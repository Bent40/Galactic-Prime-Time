const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../logger');
const { usernameError, passwordError, validationMessage } = require('../utils/validate');

const router = express.Router();

function signToken(userId, isAdmin = false) {
  return jwt.sign(
    { userId, isAdmin },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '30d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { password } = req.body || {};
    // The schema trims, so check (and look up) the trimmed name, or "bob " would
    // pass the duplicate check and then collide with "bob" on insert.
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
    const bad = usernameError(username) || passwordError(password);
    if (bad) return res.status(400).json({ error: bad });

    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: 'Username already taken' });

    const user = await User.create({ username, password });
    const token = signToken(user._id, user.isAdmin);
    logger.info(`REGISTER  "${username}"  ip=${req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '?'}`);
    res.status(201).json({ token, userId: String(user._id), username: user.username, isAdmin: user.isAdmin });
  } catch (err) {
    const msg = validationMessage(err);
    if (msg) return res.status(400).json({ error: msg });
    if (err?.code === 11000) return res.status(409).json({ error: 'Username already taken' });
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body || {};
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '?').split(',')[0].trim();
    const user = await User.findOne({ username });
    if (!user) {
      logger.warn(`LOGIN FAIL  "${username}"  reason=user_not_found  ip=${ip}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      logger.warn(`LOGIN FAIL  "${username}"  reason=bad_password  ip=${ip}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken(user._id, user.isAdmin);
    logger.info(`LOGIN  OK   "${username}"${user.isAdmin ? ' [admin]' : ''}  ip=${ip}`);
    res.json({ token, userId: String(user._id), username: user.username, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/make-admin  — promote a user to admin using ADMIN_SECRET
router.post('/make-admin', async (req, res) => {
  try {
    const { username, adminSecret } = req.body;
    const secret = process.env.ADMIN_SECRET;
    if (!secret || adminSecret !== secret) {
      return res.status(403).json({ error: 'Invalid admin secret' });
    }
    const user = await User.findOneAndUpdate({ username }, { isAdmin: true }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    logger.info(`MAKE-ADMIN  "${username}"`);
    res.json({ ok: true, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
