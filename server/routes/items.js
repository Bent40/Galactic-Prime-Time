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
    const { name, icon, category, attackTypes, range, damage, damageType, specialEffects, resistance, requirements, description, qty, type, effect, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    if (!CATEGORIES.includes(category)) return res.status(400).json({ error: 'invalid category' });

    const item = await ItemTemplate.create({
      name, icon: icon || '', category,
      attackTypes: attackTypes || [],
      range: range || '', damage: damage || '',
      damageType: damageType || [],
      specialEffects: specialEffects || '',
      resistance: resistance || '',
      requirements: requirements || '',
      description: description || '',
      qty: qty || 1,
      type: type || '', effect: effect || '', notes: notes || '',
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/items/:id — update an item template
router.put('/:id', async (req, res) => {
  try {
    const { name, icon, category, attackTypes, range, damage, damageType, specialEffects, resistance, requirements, description, qty, type, effect, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    if (category && !CATEGORIES.includes(category)) return res.status(400).json({ error: 'invalid category' });

    const item = await ItemTemplate.findByIdAndUpdate(
      req.params.id,
      {
        name, icon: icon || '', category,
        attackTypes: attackTypes || [],
        range: range || '', damage: damage || '',
        damageType: damageType || [],
        specialEffects: specialEffects || '',
        resistance: resistance || '',
        requirements: requirements || '',
        description: description || '',
        qty: qty || 1,
        type: type || '', effect: effect || '', notes: notes || '',
      },
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

        let cat = state.inventory.categories.find(c => c.id === catId);
        if (!cat) {
          cat = { id: catId, name: template.category, locked: false, items: [] };
          state.inventory.categories.push(cat);
        }
        if (!cat.items) cat.items = [];

        cat.items.push({
          id: Date.now() + Math.floor(Math.random() * 10000),
          name:           template.name,
          icon:           template.icon || '',
          qty:            qty != null ? qty : template.qty,
          attackTypes:    template.attackTypes || [],
          range:          template.range || '',
          damage:         template.damage || '',
          damageType:     template.damageType || [],
          specialEffects: template.specialEffects || '',
          resistance:     template.resistance || '',
          requirements:   template.requirements || '',
          description:    template.description || '',
          // legacy
          type:           template.type || '',
          equippedOn:     '',
          effect:         template.effect || '',
          notes:          template.notes || '',
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
