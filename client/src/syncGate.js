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
