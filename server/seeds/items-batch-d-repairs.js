/**
 * Item Drafting — Batch D: repair pass on the 28 legacy templates.
 * Run: node seed-items.js --file ./seeds/items-batch-d-repairs.js --apply --force
 * (--force is REQUIRED here by design: every entry targets an existing template.)
 *
 * Scope: classification metadata ONLY — subtype stamps for all, tiers for the
 * untiered (per ID-0.5 "all items have tiers"; System/Key items and Materials
 * stay exempt per ID-1). Owner-authored stats, names, and text are untouched.
 * Each entry lists ONLY the fields it repairs; seed-items.js writes only those.
 *
 * Deliberately absent: Bandage — Batch A carries its Basic counter-spec; the
 * owner resolves that collision at the Batch A apply (--force adopts the spec).
 */

module.exports = [
  // — Weapons —
  { name: 'Scalpel (Used)', subtype: 'Bladed' },
  { name: 'Short Sword', subtype: 'Bladed' },
  { name: 'Kunai', subtype: 'Thrown' },
  { name: 'Metal Gauntlets', subtype: 'Martial' },
  { name: 'Metal Claw Coverings', subtype: 'Martial' },

  // — Equipment (armor family) —
  { name: 'Pointed Clown Hat', subtype: 'Armor' },
  { name: 'Ruffled Clown Collar', subtype: 'Armor' },
  { name: 'Fedora Hat', subtype: 'Armor' },
  { name: 'Superhero Outfit', subtype: 'Armor' },
  { name: "Big Brother Roach's Suit", subtype: 'Armor' },
  { name: 'Garden Gloves', subtype: 'Armor' },
  { name: 'Musketeer Hat', subtype: 'Armor', tier: 'Crude' },
  { name: 'Soft Boots', subtype: 'Armor', tier: 'Crude' },
  { name: 'Blue Cape', subtype: 'Armor', tier: 'Crude' },

  // — Tools —
  { name: 'Medical Suture Kit', subtype: 'Tool' },
  { name: 'Sewing Kit', subtype: 'Tool' },

  // — Consumables & ammo —
  { name: 'Stun Net', subtype: 'Consumable' },
  { name: 'Arrow', subtype: 'Consumable' },
  { name: 'Bag Of Trail Mix', subtype: 'Consumable', tier: 'Crude' },

  // — Coupons (voucher kits; System Items stay untiered) —
  { name: 'Basic Weapon Coupon', subtype: 'Kit' },
  { name: 'Silver Modifier Coupon', subtype: 'Kit' },
  { name: 'Generic Outfit Coupon', subtype: 'Kit' },

  // — Tomes —
  { name: 'Tome Of Submission', subtype: 'Tome', tier: 'Quality' },

  // — Materials (baseline band; materials stay untiered) —
  { name: 'Wood scraps', subtype: 'Material' },
  { name: 'Fabric Scraps', subtype: 'Material' },

  // — Oddities —
  { name: 'Beachy - The Beach Ball', subtype: 'Trinket', tier: 'Crude' },
  // Middle Brother's Doll: Key Item — exempt from tiers and subtypes; left as-is.
];
