const express = require('express');
const Table = require('../models/Table');
const TableMap = require('../models/TableMap');
const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/adminAuth');
const logger = require('../logger');
const Message = require('../models/Message');
const User = require('../models/User');
const Character = require('../models/Character');
const dice = require('../dice');

const router = express.Router();

// A map background is a data URL in the document. 8M characters of base64 is
// ~6 MB of image — a full-size Inkarnate export — and leaves headroom under
// express.json's 10 MB body cap and Mongo's 16 MB document cap.
const MAX_IMAGE_CHARS = 8_000_000;
const TOKEN_KINDS = ['player', 'enemy', 'npc', 'marker'];

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const FX_TYPES = ['Bleed', 'Crush', 'Burn', 'Chill', 'Poison', 'Infection', 'Dissolution', 'Heal'];
const FX_WINDOW_MS = 20_000;   // how long an effect stays visible to pollers
const FX_KEEP_MS = 60_000;     // how long it stays in the document before pruning
const CUE_SOURCES = ['youtube', 'audio'];
const CUE_TRIGGERS = ['manual', 'map-live'];

// Whitelist + coerce one cue. `existing` lets PATCH keep fields it does not name.
function normCue(input, existing = {}) {
  const c = { ...existing };
  if (input.name != null) c.name = String(input.name).slice(0, 60);
  if (input.source != null) c.source = CUE_SOURCES.includes(input.source) ? input.source : 'youtube';
  if (input.ref != null) c.ref = String(input.ref).trim();
  if (input.start != null) c.start = Math.max(0, num(input.start));
  if (input.end != null) c.end = Math.max(0, num(input.end));
  if (input.loop != null) c.loop = !!input.loop;
  if (input.volume != null) c.volume = Math.max(0, Math.min(100, Math.round(num(input.volume, 80))));
  if (input.trigger != null) c.trigger = CUE_TRIGGERS.includes(input.trigger) ? input.trigger : 'manual';
  if (input.mapId != null) c.mapId = String(input.mapId);
  if (c.end && c.end <= c.start) c.end = 0;   // a segment that ends before it starts runs to the end instead
  return c;
}
function cueProblem(c) {
  if (!c.name || !c.name.trim()) return 'name required';
  if (!c.ref) return c.source === 'youtube' ? 'YouTube video id required' : 'audio URL required';
  if (c.source === 'youtube' && !/^[\w-]{6,20}$/.test(c.ref)) return 'not a YouTube video id (paste the 11-character id, e.g. dQw4w9WgXcQ)';
  if (c.source === 'audio') {
    if (c.ref.length > MAX_IMAGE_CHARS) return `audio too large (max ${MAX_IMAGE_CHARS} chars)`;
    if (!/^https:\/\//.test(c.ref) && !/^data:audio\/[\w.+-]+;base64,/.test(c.ref)) return 'audio must be an https URL or a data:audio/* URL';
  }
  return null;
}
const liveFx = (fx, now = Date.now()) => (fx || []).filter(f => now - new Date(f.at).getTime() < FX_WINDOW_MS);
const pruneFx = (fx, now = Date.now()) => (fx || []).filter(f => now - new Date(f.at).getTime() < FX_KEEP_MS);
const currentCue = (table) => (table.sound?.cueId ? (table.cues || []).find(c => c.cueId === table.sound.cueId) || null : null);
function setSound(table, cueId) {
  const s = table.sound || {};
  table.sound = { cueId: cueId || '', playing: !!cueId, startedAt: cueId ? new Date() : null, seq: (s.seq || 0) + 1 };
  table.markModified && table.markModified('sound');
}
const seated = (table, userId) => (table.seats || []).some(s => s.userId === String(userId));
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

// The GM's projection of a map for the poll: everything but the image.
function gmView(map) {
  if (!map) return null;
  const o = typeof map.toObject === 'function' ? map.toObject() : { ...map };
  delete o.image;
  return o;
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

// GET /api/tables/:id/live — THE POLL. Seated players and the GM both call this every
// couple of seconds; it never carries the map image (fetch that once, below). Players
// get the player projection + only the cue that is playing; the GM gets everything.
router.get('/:id/live', requireAuth, async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    if (!req.isAdmin && !seated(table, req.userId)) return res.status(403).json({ error: 'You are not seated at this table' });
    const live = table.activeMapId ? await TableMap.findById(table.activeMapId) : null;
    const now = Date.now();
    const cue = currentCue(table);
    const out = {
      _id: table._id, name: table.name, description: table.description, status: table.status,
      seats: table.seats.map(s => s.userId), activeMapId: table.activeMapId,
      sound: table.sound, cue, fx: liveFx(table.fx, now), serverNow: now,
      map: req.isAdmin ? gmView(live) : (() => { const v = playerView(live); if (v) delete v.image; return v; })(),
    };
    if (req.isAdmin) out.cues = table.cues;
    res.json(out);
  } catch (err) { fail(res, 'GET /api/tables/:id/live', err); }
});

// GET /api/tables/:id/maps/:mapId/image — the background, fetched once per map. A
// player may fetch only the LIVE map's image; the GM any map on the table.
router.get('/:id/maps/:mapId/image', requireAuth, async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    if (!req.isAdmin) {
      if (!seated(table, req.userId)) return res.status(403).json({ error: 'You are not seated at this table' });
      if (String(table.activeMapId) !== String(req.params.mapId)) return res.status(403).json({ error: 'That map is not live' });
    }
    const map = await TableMap.findOne({ _id: req.params.mapId, tableId: table._id }).select('image width height').lean();
    if (!map) return res.status(404).json({ error: 'Map not found on this table' });
    res.json({ image: map.image, width: map.width, height: map.height });
  } catch (err) { fail(res, 'GET map image', err); }
});

// POST /api/tables/:id/roll { kind, height?, stat?, gmOnly? } — the server rolls and
// posts the result as a Message. Only the GM may make a roll GM-only.
router.post('/:id/roll', requireAuth, async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    if (!req.isAdmin && !seated(table, req.userId)) return res.status(403).json({ error: 'You are not seated at this table' });
    const b = req.body || {};
    const result = dice.roll(b.kind, { height: b.height, stat: b.stat });
    if (!result) return res.status(400).json({ error: `kind must be one of ${dice.KINDS.join(', ')}` });
    let senderName = 'GM';
    if (!req.isAdmin) {
      const c = await Character.findOne({ userId: req.userId }, 'state.identity.name').lean();
      const u = await User.findById(req.userId, 'username').lean();
      senderName = c?.state?.identity?.name?.trim() || u?.username || 'Contestant';
    } else if (b.actorName) senderName = String(b.actorName).slice(0, 60);
    const gmOnly = !!(req.isAdmin && b.gmOnly);
    const msg = await Message.create({
      sender: req.userId, senderName, recipient: null, recipientNPC: null, recipientName: null,
      text: `${result.label}: ${result.total}${result.effect ? ' — ' + result.effect : ''}`,
      kind: 'roll', roll: result, gmOnly, tableId: String(table._id),
    });
    res.status(201).json(msg);
  } catch (err) { fail(res, 'POST roll', err); }
});

// ── GM side ──────────────────────────────────────────────────────────────────
router.use(requireAdmin);

// POST /api/tables/:id/cues — add a sound cue
router.post('/:id/cues', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    const cue = normCue(req.body || {}, { cueId: uid(), name: '', source: 'youtube', ref: '', start: 0, end: 0, loop: true, volume: 80, trigger: 'manual', mapId: '' });
    const bad = cueProblem(cue); if (bad) return res.status(400).json({ error: bad });
    table.cues.push(cue);
    await table.save();
    res.status(201).json(table.cues[table.cues.length - 1]);
  } catch (err) { fail(res, 'POST cue', err); }
});

// PATCH /api/tables/:id/cues/:cueId
router.patch('/:id/cues/:cueId', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    const i = table.cues.findIndex(c => c.cueId === req.params.cueId);
    if (i < 0) return res.status(404).json({ error: 'Cue not found' });
    const cue = normCue(req.body || {}, typeof table.cues[i].toObject === 'function' ? table.cues[i].toObject() : { ...table.cues[i] });
    const bad = cueProblem(cue); if (bad) return res.status(400).json({ error: bad });
    table.cues[i] = cue; table.markModified('cues');
    await table.save();
    res.json(table.cues[i]);
  } catch (err) { fail(res, 'PATCH cue', err); }
});

// DELETE /api/tables/:id/cues/:cueId — stops it if it is playing
router.delete('/:id/cues/:cueId', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    const before = table.cues.length;
    table.cues = table.cues.filter(c => c.cueId !== req.params.cueId);
    if (table.cues.length === before) return res.status(404).json({ error: 'Cue not found' });
    if (table.sound?.cueId === req.params.cueId) setSound(table, '');
    await table.save();
    res.json({ ok: true });
  } catch (err) { fail(res, 'DELETE cue', err); }
});

// POST /api/tables/:id/sound { cueId } to play a cue from its start · { stop: true } to stop
router.post('/:id/sound', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    const b = req.body || {};
    if (b.stop) setSound(table, '');
    else {
      const cue = table.cues.find(c => c.cueId === b.cueId);
      if (!cue) return res.status(404).json({ error: 'Cue not found' });
      setSound(table, cue.cueId);
    }
    await table.save();
    res.json({ sound: table.sound, cue: currentCue(table) });
  } catch (err) { fail(res, 'POST sound', err); }
});

// POST /api/tables/:id/fx { type, to: {col,row}, from?: {col,row}, label? } — fire a visual effect
router.post('/:id/fx', async (req, res) => {
  try {
    const table = await loadTable(req, res); if (!table) return;
    const b = req.body || {};
    if (!FX_TYPES.includes(b.type)) return res.status(400).json({ error: `type must be one of ${FX_TYPES.join(', ')}` });
    if (!b.to || b.to.col == null || b.to.row == null) return res.status(400).json({ error: 'to {col,row} required' });
    const fx = { fxId: uid(), type: b.type, to: { col: Math.round(num(b.to.col)), row: Math.round(num(b.to.row)) },
                 from: b.from && b.from.col != null ? { col: Math.round(num(b.from.col)), row: Math.round(num(b.from.row)) } : null,
                 label: String(b.label || '').slice(0, 40), at: new Date() };
    table.fx = [...pruneFx(table.fx), fx];
    await table.save();
    res.status(201).json(fx);
  } catch (err) { fail(res, 'POST fx', err); }
});

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
        // a cue with trigger 'map-live' bound to this map starts the moment it goes live
        const auto = (table.cues || []).find(c => c.trigger === 'map-live' && c.mapId === String(map._id));
        if (auto) setSound(table, auto.cueId);
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
module.exports.normCue = normCue;
module.exports.cueProblem = cueProblem;
module.exports.liveFx = liveFx;
module.exports.FX_TYPES = FX_TYPES;
