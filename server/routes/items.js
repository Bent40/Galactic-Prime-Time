const express = require('express');
const ItemTemplate = require('../models/ItemTemplate');
const Character = require('../models/Character');
const requireAdmin = require('../middleware/adminAuth');

const router = express.Router();
router.use(requireAdmin);

const CATEGORIES = ['Equipment', 'Weapons', 'Tools', 'Consumables', 'Misc'];

// GET /api/items — list all item templates grouped by category
router.get('/', async (req, res) => {
  try {
    const items = await ItemTemplate.find().sort({ category: 1, name: 1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/items — create a new item template
router.post('/', async (req, res) => {
  try {
    const { name, category, qty, type, damage, range, effect, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    if (!CATEGORIES.includes(category)) return res.status(400).json({ error: 'invalid category' });

    const item = await ItemTemplate.create({ name, category, qty: qty || 1, type, damage, range, effect, notes });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/items/:id — update an item template
router.put('/:id', async (req, res) => {
  try {
    const { name, category, qty, type, damage, range, effect, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    if (category && !CATEGORIES.includes(category)) return res.status(400).json({ error: 'invalid category' });

    const item = await ItemTemplate.findByIdAndUpdate(
      req.params.id,
      { name, category, qty: qty || 1, type, damage, range, effect, notes },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/items/:id — delete an item template
router.delete('/:id', async (req, res) => {
  try {
    const item = await ItemTemplate.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/items/give — give an item to one or more players
// Body: { userIds[], itemId, qty (optional override) }
router.post('/give', async (req, res) => {
  try {
    const { userIds, itemId, qty } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0)
      return res.status(400).json({ error: 'userIds array required' });
    if (!itemId) return res.status(400).json({ error: 'itemId required' });

    const template = await ItemTemplate.findById(itemId).lean();
    if (!template) return res.status(404).json({ error: 'Item not found' });

    // Map category name → inventory category id used by character sheet
    const CAT_ID_MAP = {
      'Equipment':   10,
      'Weapons':     11,
      'Tools':       12,
      'Consumables': 13,
      'Misc':        14,
    };
    const catId = CAT_ID_MAP[template.category] || 14;

    const results = [];
    for (const userId of userIds) {
      try {
        const character = await Character.findOne({ userId });
        if (!character) { results.push({ userId, ok: false, error: 'Character not found' }); continue; }

        const state = character.state || {};
        if (!state.inventory) state.inventory = { categories: [] };
        if (!state.inventory.categories) state.inventory.categories = [];

        // Find the matching category, or create it
        let cat = state.inventory.categories.find(c => c.id === catId);
        if (!cat) {
          cat = { id: catId, name: template.category, collapsed: false, items: [] };
          state.inventory.categories.push(cat);
        }
        if (!cat.items) cat.items = [];

        cat.items.push({
          id: Date.now() + Math.floor(Math.random() * 10000),
          name:       template.name,
          qty:        qty != null ? qty : template.qty,
          type:       template.type || '',
          equippedOn: '',
          damage:     template.damage || '',
          range:      template.range || '',
          effect:     template.effect || '',
          notes:      template.notes || '',
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

module.exports = router;
