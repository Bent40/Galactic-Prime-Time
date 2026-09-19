/**
 * CURIOS — worthless junk for the Odds & Ends shelf (§19.3), authored 2026-09-19.
 *
 * 🔴 WHY THIS BATCH EXISTS. The tutorial store's Misc shelf held FOUR items and all
 * four were Growth items — the deferred-payoff pieces that are supposed to look
 * like nothing. Their PRICE was careful (every one is Crude, so 1 UT, under the
 * Basic 3 that would have marked them out) but the SHELF gave them away: one small
 * shelf of unexplained trinkets beside four shelves of obvious kit is a thing a
 * player points at and asks about.
 *
 * ⭐ So these are the company. Every one is genuinely, permanently worthless: no
 * `specialEffects`, no damage, no resistance, no uses, nothing hidden and nothing
 * coming later. **Do not ever give one a secret.** The moment a curio pays off,
 * the players learn the shelf is worth searching and the camouflage is spent.
 *
 * ⚠️ They are structurally IDENTICAL to a Growth item on the card — same category,
 * same tier, same price, same empty effects, same flat one-line read. The only
 * difference is `themes`, which is template-side bookkeeping and never reaches the
 * player's copy.
 *
 * ⭐ Two of them are deliberately MORE intriguing than anything on the growth
 * shelf (`Unlabelled Key`, `Ticket Stub`). A party that decides to investigate the
 * weird trinket should have a decent chance of investigating the wrong one.
 *
 *   node seed-items.js --file ./seeds/items-curios.js            → dry run
 *   node seed-items.js --file ./seeds/items-curios.js --apply
 */
const curio = (name, icon, description) => ({
  category: 'Misc', subtype: 'Trinket', tier: 'Crude', source: 'batch-curios',
  boxTiers: [], themes: ['junk'], name, icon, description,
});

module.exports = [
  curio('Foam Finger',        '🖐', 'A giant foam hand. It says GO TEAM in a language nobody here speaks.'),
  curio('Souvenir Globe',     '🔮', 'A snow globe of a city. Shake it and it snows grey.'),
  curio('Branded Lanyard',    '🎗', 'Corporation lanyard. Holds a badge you do not have.'),
  curio('Chipped Mug',        '☕', 'A mug. Someone scratched their initials into the base.'),
  curio('Deck of Cards',      '🃏', 'Fifty-one cards. Nobody will say which one is missing.'),
  curio('Pocket Mirror',      '🪞', 'A small mirror in a plastic case. The hinge is loose.'),
  curio('Wind-Up Toy',        '🪀', 'Winds up. Walks four steps. Falls over.'),
  curio('Pressed Flower',     '🥀', 'Flat and gone brown. It still smells like something.'),
  curio('Tin Whistle',        '🎺', 'One note, and not a good one.'),
  curio('Unlabelled Key',     '🔑', 'A key. It opens nothing in the store; the clerk checked.'),
  curio('Ticket Stub',        '🎫', 'A stub from a show that has not aired yet.'),
  curio('Knot of String',     '🧵', 'String. About a metre of it, badly wound.'),
];
