const express = require('express');
const Table = require('../models/Table');
const TableMap = require('../models/TableMap');
const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/adminAuth');
const logger = require('../logger');

const router = express.Router();

// A map background is a data URL in the document. 8M characters of base64 is
// ~6 MB of image — a full-size Inkarnate export — and leaves headroom under
// express.json's 10 MB body cap and Mongo's 16 MB document cap.
const MAX_IMAGE_CHARS = 8_000_000;
const TOKEN_KINDS = ['player', 'enemy', 'npc', 'marker'];

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const isHex = s => /^#[0-9a-fA-F]{3,8}$/.test(s || '');
const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);

function imageProblem(image) {
  if (image == null || image === '') return null;
  if (typeof image !== 'string') return 'image must be a string';
  if (image.length > MAX_IMAGE_CHARS) return `image too large (max ${MAX_IMAGE_CHARS} chars — export a smaller JPG)`;
  if (!/^data:image\/(png|jpe?g|webp|gif);base64,/.test(image) && !/^https:\/\//.test(image)) {
    return 'image must be a data:image/* URL or an https URL';
  }
  return null;
}

// Whitelist + coerce one token. `existing` lets PATCH keep fields it does not name.
function normToken(input, existing = {}) {
  const t = { ...existing };
  if (input.name != null) t.name = String(input.name).slice(0, 60);
  if (input.kind != null) t.kind = TOKEN_KINDS.includes(input.kind) ? input.kind : 'marker';
  if (input.refId != null) t.refId = String(input.refId);
  if (input.label != null) t.label = String(input.label).slice(0, 3);
  if (input.color != null) t.color = isHex(input.color) ? input.color : (existing.color || '#94a6c6');
  if (input.tier != null) t.tier = String(input.tier);
  if (input.size != null) t.size = String(input.size);
  if (input.col != null) t.col = Math.max(0, Math.round(num(input.col)));
  if (input.row != null) t.row = Math.max(0, Math.round(num(input.row)));
  if (input.hidden != null) t.hidden = !!input.hidden;
  if (Array.isArray(input.conditions)) t.conditions = input.conditions.map(String).slice(0, 12);
  if (Array.isArray(input.parts)) {
    t.parts = input.parts.map(p => ({
      name: String(p.name || 'Part'),
      maxHp: Math.max(0, num(p.maxHp)),
      currentHp: Math.max(0, num(p.currentHp, num(p.maxHp))),
      lethal: !!p.lethal,
    }));
  }
  return t;
}

// What a seated PLAYER may see of a map: no GM notes, no hidden tokens, and the
// fog key-set only when fog is on (the client draws the darkness).
function playerView(map) {
  if (!map) return null;
  return {
    _id: map._id, name: map.name, image: map.image, width: map.width, height: map.height,
    grid: map.grid, fogEnabled: map.fogEnabled, revealed: map.fogEnabled ? map.revealed : [],
    tokens: (map.tokens || []).filter(t => !t.hidden),
    updatedAt: map.updatedAt,
  };
}

async function loadTable(req, res) {
  const table = await Table.findById(req.params.id);
  if (!table) { res.status(404).json({ error: 'Table not found' }); return null; }
  return table;
}
async function loadMap(req, res, table) {
  const map = await TableMap.findOne({ _id: req.params.mapId, tableId: table._id });
  if (!map) { res.status(404).json({ error: 'Map not found on this table' }); return null; }
  return map;
}
const fail = (res, where, err) => { logger.error(`${where} failed`, { message: err.message }); res.status(500).json({ error: 'Server error' }); };

// ── Player side ──────────────────────────────────────────────────────────────

// GET /api/tables/mine — every table this user is seated at, each with its LIVE map
// projected for a player. The seat is the permission: no seat, no table.
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const tables = await Table.find({ 'seats.userId': String(req.userId) }).sort({ updatedAt: -1 }).lean();
    const out = [];
    for (const t of tables) {
      const live = t.activeMapId ? await TableMap.findById(t.activeMapId).lean() : null;
      out.push({ _id: t._id, name: t.name, description: t.description, status: t.status,
                 seats: t.seats.map(s => s.userId), live: playerView(live), updatedAt: t.updatedAt });
    }
    res.json(out);
  } catch (err) { fail(res, 'GET /api/tables/mine', err); }
});

// PATCH /api/tables/:id/tokens/:tokenId/move — the ONE player write: move your own
// token on the live map. Any other token, any other map → 403.
router.patch('/:id/tokens/:tokenId/move', requireAuth, async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    if (!table.seats.some(s => s.userId === String(req.userId))) return res.status(403).json({ error: 'You are not seated at this table' });
    if (!table.activeMapId) return res.status(409).json({ error: 'No live map' });
    const map = await TableMap.findById(table.activeMapId);
    if (!map) return res.status(409).json({ error: 'No live map' });
    const tok = map.tokens.find(t => t.tokenId === req.params.tokenId);
    if (!tok) return res.status(404).json({ error: 'Token not found' });
    if (tok.kind !== 'player' || tok.refId !== String(req.userId)) return res.status(403).json({ error: 'Not your token' });
    const { col, row } = req.body || {};
    if (col == null || row == null) return res.status(400).json({ error: 'col and row required' });
    tok.col = Math.max(0, Math.round(num(col))); tok.row = Math.max(0, Math.round(num(row)));
    map.markModified('tokens');
    await map.save();
    res.json({ ok: true, token: tok });
  } catch (err) { fail(res, 'PATCH move', err); }
});

// ── GM side ──────────────────────────────────────────────────────────────────
router.use(requireAdmin);

// GET /api/tables — every table, with seat and map counts (no images)
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().sort({ updatedAt: -1 }).lean();
    const counts = await TableMap.aggregate([{ $group: { _id: '$tableId', n: { $sum: 1 } } }]);
    const byTable = Object.fromEntries(counts.map(c => [String(c._id), c.n]));
    res.json(tables.map(t => ({ ...t, mapCount: byTable[String(t._id)] || 0 })));
  } catch (err) { fail(res, 'GET /api/tables', err); }
});

// POST /api/tables { name, description }
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body || {};
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'name required' });
    const table = await Table.create({ name: String(name).trim(), description: String(description || ''), createdBy: String(req.userId || '') });
    logger.info(`TABLE CREATE "${table.name}" by=${req.userId}`);
    res.status(201).json(table);
  } catch (err) { fail(res, 'POST /api/tables', err); }
});

// GET /api/tables/:id — the table plus its maps WITHOUT images (fetch a map for that)
router.get('/:id', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    const maps = await TableMap.find({ tableId: table._id }).select('-image').sort({ createdAt: 1 }).lean();
    res.json({ ...table.toObject(), maps });
  } catch (err) { fail(res, 'GET /api/tables/:id', err); }
});

// PATCH /api/tables/:id { name, description, status, activeMapId }
router.patch('/:id', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    const { name, description, status, activeMapId } = req.body || {};
    if (name != null) { if (!String(name).trim()) return res.status(400).json({ error: 'name cannot be empty' }); table.name = String(name).trim(); }
    if (description != null) table.description = String(description);
    if (status != null) { if (!['open', 'closed'].includes(status)) return res.status(400).json({ error: 'status must be open or closed' }); table.status = status; }
    if (activeMapId !== undefined) {
      if (activeMapId === null || activeMapId === '') table.activeMapId = null;
      else {
        const map = await TableMap.findOne({ _id: activeMapId, tableId: table._id });
        if (!map) return res.status(400).json({ error: 'activeMapId is not a map on this table' });
        table.activeMapId = map._id;
      }
    }
    await table.save();
    res.json(table);
  } catch (err) { fail(res, 'PATCH /api/tables/:id', err); }
});

// DELETE /api/tables/:id — the table and every map on it
router.delete('/:id', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    await TableMap.deleteMany({ tableId: table._id });
    await table.deleteOne();
    logger.warn(`TABLE DELETE "${table.name}" id=${table._id} by=${req.userId}`);
    res.json({ ok: true });
  } catch (err) { fail(res, 'DELETE /api/tables/:id', err); }
});

// POST /api/tables/:id/seats { userId } — seat a player (idempotent)
router.post('/:id/seats', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    const userId = String((req.body || {}).userId || '').trim();
    if (!userId) return res.status(400).json({ error: 'userId required' });
    if (!table.seats.some(s => s.userId === userId)) table.seats.push({ userId });
    await table.save();
    res.json(table);
  } catch (err) { fail(res, 'POST seats', err); }
});

// DELETE /api/tables/:id/seats/:userId — unseat a player
router.delete('/:id/seats/:userId', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    table.seats = table.seats.filter(s => s.userId !== req.params.userId);
    await table.save();
    res.json(table);
  } catch (err) { fail(res, 'DELETE seat', err); }
});

// POST /api/tables/:id/maps { name, image, width, height, grid }
router.post('/:id/maps', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    const { name, image, width, height, grid, notes } = req.body || {};
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'name required' });
    const bad = imageProblem(image); if (bad) return res.status(400).json({ error: bad });
    const map = await TableMap.create({
      tableId: table._id, name: String(name).trim(), image: image || '',
      width: Math.max(0, num(width)), height: Math.max(0, num(height)),
      grid: grid && typeof grid === 'object' ? grid : {}, notes: String(notes || ''),
    });
    table.updatedAt = new Date(); await table.save();
    const out = map.toObject(); delete out.image;
    res.status(201).json(out);
  } catch (err) { fail(res, 'POST maps', err); }
});

// GET /api/tables/:id/maps/:mapId — the full map, image included
router.get('/:id/maps/:mapId', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    const map = await loadMap(req, res, table); if (!map) return;
    res.json(map);
  } catch (err) { fail(res, 'GET map', err); }
});

// PATCH /api/tables/:id/maps/:mapId — any map field; `tokens` replaces the whole array
router.patch('/:id/maps/:mapId', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    const map = await loadMap(req, res, table); if (!map) return;
    const b = req.body || {};
    if (b.name != null) { if (!String(b.name).trim()) return res.status(400).json({ error: 'name cannot be empty' }); map.name = String(b.name).trim(); }
    if (b.image !== undefined) { const bad = imageProblem(b.image); if (bad) return res.status(400).json({ error: bad }); map.image = b.image || ''; }
    if (b.width != null) map.width = Math.max(0, num(b.width));
    if (b.height != null) map.height = Math.max(0, num(b.height));
    if (b.grid && typeof b.grid === 'object') map.grid = { ...map.grid.toObject(), ...b.grid };
    if (b.visible != null) map.visible = !!b.visible;
    if (b.fogEnabled != null) map.fogEnabled = !!b.fogEnabled;
    if (Array.isArray(b.revealed)) map.revealed = b.revealed.map(String);
    if (b.notes != null) map.notes = String(b.notes);
    if (Array.isArray(b.tokens)) map.tokens = b.tokens.map(t => normToken(t, { tokenId: t.tokenId || uid(), name: 'Token' }));
    await map.save();
    const out = map.toObject(); if (b.image === undefined) delete out.image;
    res.json(out);
  } catch (err) { fail(res, 'PATCH map', err); }
});

// DELETE /api/tables/:id/maps/:mapId — and clear activeMapId if it was live
router.delete('/:id/maps/:mapId', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    const map = await loadMap(req, res, table); if (!map) return;
    await map.deleteOne();
    if (String(table.activeMapId) === String(map._id)) { table.activeMapId = null; await table.save(); }
    res.json({ ok: true, activeMapId: table.activeMapId });
  } catch (err) { fail(res, 'DELETE map', err); }
});

// POST /api/tables/:id/maps/:mapId/tokens — add one token
router.post('/:id/maps/:mapId/tokens', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    const map = await loadMap(req, res, table); if (!map) return;
    const b = req.body || {};
    if (!b.name) return res.status(400).json({ error: 'name required' });
    const tok = normToken(b, { tokenId: uid(), name: 'Token', kind: 'marker', color: '#94a6c6', col: 0, row: 0, hidden: false, parts: [], conditions: [] });
    map.tokens.push(tok);
    await map.save();
    res.status(201).json(map.tokens[map.tokens.length - 1]);
  } catch (err) { fail(res, 'POST token', err); }
});

// PATCH /api/tables/:id/maps/:mapId/tokens/:tokenId — move, hide, damage, rename…
router.patch('/:id/maps/:mapId/tokens/:tokenId', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    const map = await loadMap(req, res, table); if (!map) return;
    const i = map.tokens.findIndex(t => t.tokenId === req.params.tokenId);
    if (i < 0) return res.status(404).json({ error: 'Token not found' });
    map.tokens[i] = normToken(req.body || {}, map.tokens[i].toObject());
    map.markModified('tokens');
    await map.save();
    res.json(map.tokens[i]);
  } catch (err) { fail(res, 'PATCH token', err); }
});

// DELETE /api/tables/:id/maps/:mapId/tokens/:tokenId
router.delete('/:id/maps/:mapId/tokens/:tokenId', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    const map = await loadMap(req, res, table); if (!map) return;
    const before = map.tokens.length;
    map.tokens = map.tokens.filter(t => t.tokenId !== req.params.tokenId);
    if (map.tokens.length === before) return res.status(404).json({ error: 'Token not found' });
    await map.save();
    res.json({ ok: true });
  } catch (err) { fail(res, 'DELETE token', err); }
});

module.exports = router;
module.exports.playerView = playerView;
module.exports.normToken = normToken;
module.exports.imageProblem = imageProblem;
module.exports.MAX_IMAGE_CHARS = MAX_IMAGE_CHARS;
