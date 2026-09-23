/**
 * soundEngine.js — the cue arithmetic, no React and no player.
 *
 * A cue is a SEGMENT of a source: play from `start` to `end` (0 = the end of the
 * source) and either loop the segment or run once and stop. The table's `sound`
 * state says which cue is playing and WHEN it started (server time), so every
 * client — including one that opens the page mid-fight — can compute where in
 * the source it should be right now and seek there.
 *
 * The browser rules this has to live with:
 *   • nothing plays before a user gesture (autoplay policy) — the page shows an
 *     "enable sound" button once, then every cue the GM fires plays unasked;
 *   • YouTube's IFrame API and <audio> both expose currentTime, seekTo/currentTime=,
 *     play and pause, so one engine drives both.
 */

/** "1:50" → 110 · "0:36.5" → 36.5 · "95" → 95 · junk → 0 */
export function parseTimecode(s) {
  if (typeof s === 'number') return Math.max(0, s);
  const t = String(s || '').trim();
  if (!t) return 0;
  if (/^\d+(\.\d+)?$/.test(t)) return Number(t);
  const m = t.match(/^(\d+):(\d{1,2})(?:\.(\d+))?$/);
  if (!m) return 0;
  return Number(m[1]) * 60 + Number(m[2]) + (m[3] ? Number('0.' + m[3]) : 0);
}

/** 110 → "1:50" · 36.5 → "0:36" */
export function formatTimecode(sec) {
  const s = Math.max(0, Math.floor(Number(sec) || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Accepts a bare 11-char id, watch?v=, youtu.be/, shorts/, embed/ — returns the id or ''. */
export function parseYouTubeRef(s) {
  const t = String(s || '').trim();
  if (/^[\w-]{11}$/.test(t)) return t;
  const m = t.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/);
  return m ? m[1] : '';
}

/** Segment length in seconds; `duration` (if known) bounds an open-ended cue. */
export function segmentLength(cue, duration = 0) {
  const end = cue.end > 0 ? cue.end : (duration || 0);
  return Math.max(0, end - (cue.start || 0));
}

/**
 * Where in the SOURCE the cue should be, `elapsed` seconds after it started.
 * Loops wrap inside the segment; a one-shot past its end is finished (null).
 * An open-ended cue with unknown duration just runs from `start`.
 */
export function expectedPosition(cue, elapsed, duration = 0) {
  const start = cue.start || 0;
  const len = segmentLength(cue, duration);
  if (elapsed < 0) elapsed = 0;
  if (len <= 0) return start + elapsed;               // no known end: play on
  if (cue.loop) return start + (elapsed % len);
  return elapsed >= len ? null : start + elapsed;      // one-shot: finished after len
}

/** Seconds elapsed since the server said the cue started, on the client's clock. */
export function elapsedSince(startedAt, serverNow, clientNow = Date.now(), clientNowAtSync = clientNow) {
  // serverNow was received when the client clock read clientNowAtSync; project it forward
  const serverEstimate = serverNow + (clientNow - clientNowAtSync);
  return Math.max(0, (serverEstimate - new Date(startedAt).getTime()) / 1000);
}

/** Should the player seek? Only when it has drifted past the tolerance (seeks stutter). */
export function shouldSeek(current, expected, tolerance = 1.5) {
  if (expected == null || !Number.isFinite(current)) return false;
  return Math.abs(current - expected) > tolerance;
}

/** The per-tick decision the player component runs: { action: 'stop'|'seek'|'none', to } */
export function tick(cue, sound, current, elapsed, duration = 0) {
  if (!cue || !sound?.playing) return { action: 'stop' };
  const end = cue.end > 0 ? cue.end : (duration || 0);
  const expected = expectedPosition(cue, elapsed, duration);
  if (expected == null) return { action: 'stop' };                      // one-shot finished
  if (end > 0 && current >= end - 0.05) {
    return cue.loop ? { action: 'seek', to: cue.start || 0 } : { action: 'stop' };
  }
  if (shouldSeek(current, expected)) return { action: 'seek', to: expected };
  return { action: 'none' };
}
