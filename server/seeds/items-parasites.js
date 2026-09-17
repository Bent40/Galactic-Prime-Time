/**
 * THE FIVE PARASITES — tutorial hatchery drop (owner, 2026-09-17).
 * Seed via: node seed-items.js --file ./seeds/items-parasites.js   (dry run)
 *           node seed-items.js --file ./seeds/items-parasites.js --apply
 *
 * ⚠️ PUBLIC READS ONLY — the batch-c C-4 convention. A Growth item's card shows
 * ONLY what anyone could see by looking at it. NO specialEffects field, ever.
 * The gauge, the stages and the eruption live with the GM
 * (rulebook/growth-items-and-parasites.md). The players learn what these do by
 * carrying them.
 *
 * ⭐ THE NAME HINTS THE GAUGE (owner's constraint) and nothing else. Dread-Eye
 * reads danger; Falsewort tastes for lies; The Beggar weighs want; Ringworm
 * counts rings; Gravemoss smells what died here. That is the whole basis a
 * player has for choosing, and it is enough.
 *
 * 🔒 They are LOOT THEY CANNOT ESCAPE (owner). Little Bro made them, the way he
 * made the suit and the doll — thrown out for being weak, he answered by making
 * more family, and the party inherits his children. No save, no roll: something
 * crawls into skin or roboparts. The only choice the system offers is WHICH,
 * and no two contestants may hold the same one.
 */

// Every parasite is the same object with a different appetite. Category/tier/subtype
// are identical on purpose: nothing on the card sorts them by power, because nothing
// about them IS power until it has been fed.
const P = (it) => ({
  category: 'Misc', tier: 'Crude', subtype: 'Growth',
  source: 'parasites', boxTiers: [], themes: ['story', 'parasite'],
  ...it,
});

module.exports = [

  P({ name: 'Dread-Eye', icon: '👁',
      description: 'A specimen jar, hatchery stock. Something pale and lidded. It is warm, and it is facing you.' }),

  P({ name: 'Falsewort', icon: '🌿',
      description: 'A grey sprig with a fleshy root. Kept in brine. The leaves curl when anyone speaks near it.' }),

  P({ name: 'The Beggar', icon: '🫱',
      description: 'Small, thin, and already reaching. The jar is scratched from the inside.' }),

  P({ name: 'Ringworm', icon: '🪱',
      description: 'A coil of something banded like cut wood. You can count the bands. There are more than there should be.' }),

  P({ name: 'Gravemoss', icon: '🍂',
      description: 'A wet grey mat that smells like turned earth. It is the only one of the five that is quiet.' }),

];
