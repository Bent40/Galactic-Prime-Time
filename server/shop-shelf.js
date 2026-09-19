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
const FILES = ['items-batch-a.js', 'items-batch-b.js', 'items-batch-c.js', 'items-safety.js'];
const ORDER = ['Consumables', 'Weapons', 'Equipment', 'Tools', 'Misc'];

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
    .filter(i => i.tier === 'Crude' || i.tier === 'Basic')
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
  // ⚠️ The Growth shelf is the one that gives itself away: growth items are the
  // ONLY things in Misc, so "the weird shelf" is a category a player can point at.
  const misc = stock.filter(i => i.c === 'Misc');
  const growth = misc.filter(i => i.s === 'Growth');
  if (misc.length && growth.length === misc.length) {
    console.log(`⚠️  Odds & Ends is ${misc.length} items and ALL ${growth.length} are Growth.`);
    console.log('   Price is not the tell (every one is 1 UT) — the SHELF is.');
    console.log('   Fix: author ordinary 1 UT curios into Misc so they have company.');
  }
}

module.exports = { shelf, price };
