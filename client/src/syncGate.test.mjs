/**
 * syncGate.test.mjs — run with:
 *   node --experimental-detect-module client/src/syncGate.test.mjs
 *
 * The thing under test is "may the server's copy replace what is on screen?"
 * A wrong answer throws away a player's unsaved sheet in the middle of a
 * session, so every branch is pinned here.
 */
import { NO_CHARACTER, shouldPoll, pollOutcome, syncMessage } from './syncGate.js';

let pass = 0, fail = 0;
const ok = (label, cond, detail) => {
  if (cond) pass++;
  else { fail++; console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`); }
};
const eq = (label, got, want) =>
  ok(label, JSON.stringify(got) === JSON.stringify(want), `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);

const clean = { loaded: true, creating: false, localGen: 3, syncedGen: 3 };

// ── shouldPoll ───────────────────────────────────────────────────────────────
eq('a clean, loaded sheet polls', shouldPoll(clean), true);
eq('a brand new sheet (gen 0) polls', shouldPoll({ ...clean, localGen: 0, syncedGen: 0 }), true);
eq('DIRTY does not poll — the whole point', shouldPoll({ ...clean, localGen: 4 }), false);
eq('dirty by several edits does not poll', shouldPoll({ ...clean, localGen: 9 }), false);
eq('before the first load, no poll', shouldPoll({ ...clean, loaded: false }), false);
eq('during character creation, no poll', shouldPoll({ ...clean, creating: true }), false);
// creating starts as null (= not known yet), which must not read as "creating"
eq('creating: null still polls', shouldPoll({ ...clean, creating: null }), true);

// ── pollOutcome ──────────────────────────────────────────────────────────────
const reply = (over = {}) => ({ state: { identity: {} }, updatedAt: 'T2', ...over });
const base = { genAtRequest: 3, localGen: 3, serverVersion: 'T1' };

eq('a newer document applies', pollOutcome({ ...base, reply: reply() }), 'apply');
eq('THE RACE: they typed while it was in flight → stale',
   pollOutcome({ ...base, localGen: 4, reply: reply() }), 'stale');
ok('stale wins over everything else — even a reset reply',
   pollOutcome({ ...base, localGen: 4, reply: { error: NO_CHARACTER } }) === 'stale');
eq('the GM deleted the sheet → reset',
   pollOutcome({ ...base, reply: { error: NO_CHARACTER } }), 'reset');
eq('a 503 is NOT a reset — it is ignored',
   pollOutcome({ ...base, reply: { error: 'Database unavailable — the server is up but cannot reach MongoDB.' } }), 'ignore');
eq('any other error is ignored', pollOutcome({ ...base, reply: { error: 'Server error' } }), 'ignore');
eq('an empty reply is ignored', pollOutcome({ ...base, reply: undefined }), 'ignore');
eq('null is ignored', pollOutcome({ ...base, reply: null }), 'ignore');
eq('an UNCHANGED document is ignored — no needless re-render',
   pollOutcome({ ...base, reply: reply({ updatedAt: 'T1' }) }), 'ignore');
eq('first poll after load with no version recorded still applies',
   pollOutcome({ ...base, serverVersion: null, reply: reply() }), 'apply');
eq('a reply with no updatedAt applies rather than being skipped',
   pollOutcome({ ...base, reply: reply({ updatedAt: undefined }) }), 'apply');
// gen 0 on both sides is the common case right after login
eq('gen 0 == gen 0 is not stale', pollOutcome({ ...base, genAtRequest: 0, localGen: 0, reply: reply() }), 'apply');

// ── syncMessage ──────────────────────────────────────────────────────────────
eq('one granted point', syncMessage(0, 1), { msg: '▲ 1 level point — spend on the Body tab', type: 'ok' });
eq('three granted points pluralise', syncMessage(0, 3), { msg: '▲ 3 level points — spend on the Body tab', type: 'ok' });
eq('a grant on top of an existing pool counts the DELTA', syncMessage(2, 5), { msg: '▲ 3 level points — spend on the Body tab', type: 'ok' });
eq('one point owed', syncMessage(0, -1), { msg: '▼ 1 level point owed — refund one', type: 'err' });
eq('two owed pluralise', syncMessage(0, -2), { msg: '▼ 2 level points owed — refund one', type: 'err' });
eq('a revoke that only eats the spare pool is not a debt', syncMessage(3, 2), { msg: 'Sheet updated by the GM', type: 'ok' });
eq('anything else is generic', syncMessage(1, 1), { msg: 'Sheet updated by the GM', type: 'ok' });
eq('a grant that clears a debt reads as a grant', syncMessage(-2, 0), { msg: '▲ 2 level points — spend on the Body tab', type: 'ok' });

console.log(`\n${fail === 0 ? '✅' : '❌'} syncGate: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
