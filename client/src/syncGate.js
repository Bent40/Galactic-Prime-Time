/**
 * syncGate — when the character sheet is allowed to take the server's copy.
 *
 * The sheet polls /api/character so a level the GM granted mid-session appears
 * without a page reload. The danger is the 1500ms autosave: a poll that lands
 * while the player has unsaved edits would silently discard them, and "silently
 * discards the player's work" is the one failure this must not have. So the
 * decision is pulled out here, as two pure functions with no React in them, and
 * tested directly (syncGate.test.mjs).
 *
 * The model: localGen counts local edits, syncedGen is the highest one the
 * server has acknowledged. Equal means clean, and only a clean sheet may be
 * replaced. serverVersion is the document's updatedAt, so an unchanged document
 * costs one fetch and no re-render.
 */

// The exact body GET /api/character 404s with. Matched exactly ON PURPOSE: any
// other error-shaped reply (the 503 DB guard, a dropped request) also arrives
// without a `state`, and treating those as "no character" would walk a player
// who HAS one into the creation flow during an outage.
export const NO_CHARACTER = 'No character found';

/** Should we ask the server at all? → true | false */
export function shouldPoll({ loaded, creating, localGen, syncedGen }) {
  if (!loaded) return false;        // the first load has not landed yet
  if (creating) return false;       // the creation overlay owns the state
  return localGen === syncedGen;    // dirty sheets are never overwritten
}

/**
 * The reply came back. What do we do with it?
 *   'stale'    — the player typed while it was in flight; drop it
 *   'reset'    — the GM deleted the sheet; run creation again
 *   'ignore'   — an error, or the document has not moved; keep what we have
 *   'apply'    — take it
 */
export function pollOutcome({ genAtRequest, localGen, reply, serverVersion }) {
  if (localGen !== genAtRequest) return 'stale';
  if (reply?.error === NO_CHARACTER) return 'reset';
  if (!reply?.state) return 'ignore';
  if (reply.updatedAt && reply.updatedAt === serverVersion) return 'ignore';
  return 'apply';
}

/**
 * What to tell the player when a GM change lands. The level pool is the only
 * field they are REQUIRED to answer, so it gets the specific message; anything
 * else just says the sheet moved.
 * → { msg, type }
 */
export function syncMessage(before, after) {
  if (after > before) {
    const n = after - before;
    return { msg: `▲ ${n} level point${n === 1 ? '' : 's'} — spend on the Body tab`, type: 'ok' };
  }
  if (after < 0) {
    const n = -after;
    return { msg: `▼ ${n} level point${n === 1 ? '' : 's'} owed — refund one`, type: 'err' };
  }
  return { msg: 'Sheet updated by the GM', type: 'ok' };
}

// ── Saving ────────────────────────────────────────────────────────────────────
// apiFetch resolves with the parsed body on ANY status, so a 503 from the DB
// guard or a 500 arrives in .then(), not .catch(). Only `ok: true` means the
// server has the edit.
export function saveSucceeded(reply) {
  return reply?.ok === true;
}

// Back-off for an automatic retry after a failed save: 2s, 4s, 8s … capped at 60s.
export function retryDelay(attempt) {
  const n = Math.max(0, Math.floor(attempt || 0));
  return Math.min(2000 * 2 ** Math.min(n, 10), 60000);
}

// keepalive requests (the only kind a browser still sends while the page is
// unloading) are capped at 64 KiB of body in total. Above that the browser
// rejects the request, so send a normal one instead and do not claim it landed.
export const KEEPALIVE_MAX_BYTES = 60000;
export function canKeepalive(body) {
  return typeof body === 'string' && new Blob([body]).size <= KEEPALIVE_MAX_BYTES;
}

// Unsaved edits are mirrored into localStorage so a closed tab, a crash or an
// offline session does not lose them. Keyed per user so a shared browser never
// hands one player's sheet to another.
export function pendingKey(auth) {
  const who = auth?.userId || auth?.username;
  return who ? `gpt.pendingSave.${who}` : null;
}

/**
 * The page loaded and the browser holds a copy of edits that never got a
 * confirmed save. What now?
 *   'none'     — nothing stored (or unreadable)
 *   'restore'  — the server has not moved since those edits were made, so they
 *                are newer than what it holds: put them back and save them
 *   'landed'   — the server moved AND the copy was flushed on the way out, so
 *                the flush is what moved it: the edits are already there
 *   'conflict' — the server moved for another reason (a GM change, another
 *                device): keep the server's copy and tell the player
 */
export function restoreDecision({ stored, serverUpdatedAt }) {
  if (!stored || typeof stored !== 'object' || !stored.state) return 'none';
  if ((stored.baseVersion || null) === (serverUpdatedAt || null)) return 'restore';
  return stored.flushed ? 'landed' : 'conflict';
}
