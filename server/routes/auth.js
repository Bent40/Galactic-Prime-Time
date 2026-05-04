const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../logger');

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
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: 'Username already taken' });

    const user = await User.create({ username, password });
    const token = signToken(user._id, user.isAdmin);
    logger.info(`REGISTER  "${username}"  ip=${req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '?'}`);
    res.status(201).json({ token, username: user.username, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
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
    res.json({ token, username: user.username, isAdmin: user.isAdmin });
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
