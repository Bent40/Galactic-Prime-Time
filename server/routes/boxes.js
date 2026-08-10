const express = require('express');
const LootBox = require('../models/LootBox');
const ItemTemplate = require('../models/ItemTemplate');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/adminAuth');
const logger = require('../logger');

const router = express.Router();

// Give-style snapshot (mirrors POST /api/items/give) + category so the client
// can route the item into the right inventory container on open.
function snapshotFromTemplate(template, qty) {
  const tplMax = template.uses?.max != null ? Number(template.uses.max) : null;
  return {
    id: Date.now() + Math.floor(Math.random() * 1000000),
    name:           template.name,
    icon:           template.icon || '',
    tier:           template.tier || '',
    subtype:        template.subtype || '',
    category:       template.category || 'Misc',
    qty:            qty != null ? qty : template.qty,
    attackTypes:    template.attackTypes || [],
    range:          template.range || '',
    rpm:            template.rpm != null ? Number(template.rpm) : null,
    magazine:       template.magazine != null ? Number(template.magazine) : null,
    damage:         template.damage || '',
    damageType:     template.damageType || [],
    specialEffects: template.specialEffects || '',
    resistance:     template.resistance || '',
    requirements:   template.requirements || '',
    description:    template.description || '',
    uses:           { max: tplMax, current: tplMax },
    type: template.type || '', equippedOn: '', effect: template.effect || '', notes: template.notes || '',
  };
}

// ——— Player side ————————————————————————————————————————————————————————————

// GET /api/boxes — the logged-in player's SEALED boxes. Name/tier/mode only —
// contents stay hidden until opened.
router.get('/', requireAuth, async (req, res) => {
  try {
    const boxes = await LootBox.find({ userId: req.userId, status: 'sealed' })
      .sort({ createdAt: 1 })
      .select('name boxTier mode createdAt')
      .lean();
    res.json(boxes);
  } catch (err) {
    logger.error('GET /api/boxes failed', { message: err.message });
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/boxes/:id/open — open an owned sealed box.
//  mode 'all':      marks opened, returns { items } (client merges via update()).
//  mode 'pick-one': returns { choices } with FULL detail (informed decision);
//                   box stays sealed until /claim finalizes the pick.
router.post('/:id/open', requireAuth, async (req, res) => {
  try {
    const box = await LootBox.findOne({ _id: req.params.id, userId: req.userId });
    if (!box) return res.status(404).json({ error: 'Box not found' });
    if (box.status !== 'sealed') return res.status(400).json({ error: 'Box already opened' });

    if (box.mode === 'pick-one') {
      return res.json({ mode: 'pick-one', choices: box.items });
    }
    box.status = 'opened';
    box.openedAt = new Date();
    await box.save();
    logger.info(`BOX OPEN  "${box.name}"  → ${box.items.length} item(s)`);
    res.json({ mode: 'all', items: box.items });
  } catch (err) {
    logger.error('POST /api/boxes/:id/open failed', { id: req.params.id, message: err.message });
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/boxes/:id/claim — finalize a pick-one choice. Body: { index }
router.post('/:id/claim', requireAuth, async (req, res) => {
  try {
    const box = await LootBox.findOne({ _id: req.params.id, userId: req.userId });
    if (!box) return res.status(404).json({ error: 'Box not found' });
    if (box.status !== 'sealed') return res.status(400).json({ error: 'Box already opened' });
    if (box.mode !== 'pick-one') return res.status(400).json({ error: 'Not a pick-one box' });

    const index = Number(req.body.index);
    if (!Number.isInteger(index) || index < 0 || index >= box.items.length) {
      return res.status(400).json({ error: 'Invalid choice' });
    }
    box.status = 'opened';
    box.chosenIndex = index;
    box.openedAt = new Date();
    await box.save();
    logger.info(`BOX CLAIM "${box.name}"  → chose "${box.items[index]?.name}"`);
    res.json({ items: [box.items[index]] });
  } catch (err) {
    logger.error('POST /api/boxes/:id/claim failed', { id: req.params.id, message: err.message });
    res.status(500).json({ error: 'Server error' });
  }
});

// ——— Admin side ————————————————————————————————————————————————————————————

// POST /api/boxes — compose and give sealed boxes (one copy per recipient).
// Body: { userIds[], name, boxTier, mode, source, items: [{ itemId, qty }] }
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { userIds, name, boxTier, mode, source, items } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0)
      return res.status(400).json({ error: 'userIds array required' });
    if (!name) return res.status(400).json({ error: 'name required' });
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ error: 'items array required' });

    const snapshots = [];
    for (const entry of items) {
      const template = await ItemTemplate.findById(entry.itemId).lean();
      if (!template) return res.status(400).json({ error: `Item template not found: ${entry.itemId}` });
      snapshots.push(snapshotFromTemplate(template, entry.qty));
    }

    const results = [];
    for (const userId of userIds) {
      try {
        // Each recipient gets their own copy with fresh instance ids.
        const copy = snapshots.map(s => ({ ...s, id: Date.now() + Math.floor(Math.random() * 1000000) }));
        await LootBox.create({
          userId, name, boxTier: boxTier || '', mode: mode === 'pick-one' ? 'pick-one' : 'all',
          source: source || '', items: copy,
        });
        results.push({ userId, ok: true });
      } catch (e) {
        results.push({ userId, ok: false, error: e.message });
      }
    }
    const okCount = results.filter(r => r.ok).length;
    logger.info(`BOX GIVE  "${name}" [${boxTier || '—'}]  ${snapshots.length} item(s)  → ${okCount}/${userIds.length} players`);
    res.json({ results });
  } catch (err) {
    logger.error('POST /api/boxes failed', { message: err.message });
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/boxes/admin/log — the permanent box log: every box ever given,
// contents, chosen item, recipient, and why (source).
router.get('/admin/log', requireAdmin, async (req, res) => {
  try {
    const boxes = await LootBox.find().sort({ createdAt: -1 }).limit(200).lean();
    const users = await User.find().select('username').lean();
    const names = Object.fromEntries(users.map(u => [String(u._id), u.username]));
    res.json(boxes.map(b => ({ ...b, username: names[String(b.userId)] || '?' })));
  } catch (err) {
    logger.error('GET /api/boxes/admin/log failed', { message: err.message });
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/boxes/:id — revoke a SEALED box. Opened boxes are the log and
// cannot be deleted.
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const box = await LootBox.findById(req.params.id);
    if (!box) return res.status(404).json({ error: 'Box not found' });
    if (box.status !== 'sealed') return res.status(400).json({ error: 'Opened boxes are the log — cannot delete' });
    await box.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    logger.error('DELETE /api/boxes/:id failed', { id: req.params.id, message: err.message });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
