/**
 * The tutorial general store ("Sup, nerds!", §19.3), DERIVED from the live item
 * library rather than authored — so the shelf can never drift from the game.
 *
 *   node shop-shelf.js              → the whole shelf
 *   node shop-shelf.js --shelf Misc → one category
 *   node shop-shelf.js --json       → the data the shop page is built from
 *
 * No node_modules, no DB.
 *
 * 🔒 §19.3 prices: consumables 1–2 UT · Crude 1 · Basic 3. Stock is everything in
 * the library at Crude or Basic tier — the store sells nothing better, and the
 * Lounge takes over the moment it unlocks.
 */
const FILES = ['items-batch-a.js', 'items-batch-b.js', 'items-batch-c.js',
               'items-safety.js', 'items-curios.js'];
const ORDER = ['Consumables', 'Weapons', 'Equipment', 'Tools', 'Misc'];

/**
 * In the library but NOT on the tutorial store's shelf (owner, 2026-09-19).
 * The item keeps existing and stays grantable — it is simply not sold here.
 */
const NOT_STOCKED = new Set(['Signal Kit']);

/** §19.3, and the whole price list is these three lines. */
function price(item) {
  if (item.tier === 'Crude') return 1;
  if (item.category === 'Consumables') return 2;
  return 3;
}

function shelf() {
  const all = [];
  for (const f of FILES) {
    const m = require('./seeds/' + f);
    all.push(...(Array.isArray(m) ? m : (m.items || [])));
  }
  return all
    .filter(i => (i.tier === 'Crude' || i.tier === 'Basic') && !NOT_STOCKED.has(i.name))
    .map(i => ({
      n: i.name, ic: i.icon || '📦', c: i.category, t: i.tier, s: i.subtype || '',
      p: price(i), e: i.specialEffects || '', d: i.description || '',
      u: i.uses ? i.uses.max : null,
    }))
    .sort((a, b) => ORDER.indexOf(a.c) - ORDER.indexOf(b.c) || a.p - b.p || a.n.localeCompare(b.n));
}

if (require.main === module) {
  const stock = shelf();
  if (process.argv.includes('--json')) { console.log(JSON.stringify(stock)); process.exit(0); }
  const only = process.argv.indexOf('--shelf');
  const want = only !== -1 ? process.argv[only + 1] : null;

  console.log(`"Sup, nerds!" — §19.3 tutorial store · ${stock.length} lines\n`);
  for (const cat of ORDER) {
    const list = stock.filter(i => i.c === cat);
    if (!list.length || (want && cat !== want)) continue;
    console.log(`── ${cat} (${list.length})`);
    for (const i of list) {
      console.log(`  ${String(i.p).padStart(2)} UT  ${i.n.padEnd(26)} ${i.t.padEnd(6)} ${i.s}`);
    }
    console.log('');
  }
  // ⚠️ THE CAMOUFLAGE GATE. Growth items are meant to look like nothing, and their
  // price is careful — every one is Crude, so 1 UT, under the Basic 3 that would
  // mark them out. But a Misc shelf that is ALL growth items gives them away by
  // category instead: "what's the weird shelf?" is the question the price was
  // designed not to provoke. Keep them a minority of their own shelf.
  const misc = stock.filter(i => i.c === 'Misc');
  const growth = misc.filter(i => i.s === 'Growth');
  const share = misc.length ? growth.length / misc.length : 0;
  if (growth.length && share > 0.5) {
    console.log(`⚠️  Odds & Ends is ${misc.length} items and ${growth.length} of them are Growth `
      + `(${Math.round(share * 100)}%).`);
    console.log('   Price is not the tell (every one is 1 UT) — the SHELF is.');
    console.log('   Fix: author more worthless curios into Misc (seeds/items-curios.js).');
    process.exitCode = 1;
  } else if (growth.length) {
    console.log(`✅ Odds & Ends: ${misc.length} lines, ${growth.length} of them Growth `
      + `(${Math.round(share * 100)}%) — the shelf reads as junk.`);
  }
}

module.exports = { shelf, price };
