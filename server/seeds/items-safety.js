/**
 * Safety kit — the counterplay the crystal plague earns (f1-enemy-pass E-6).
 * PROPOSAL. Seed via: node seed-items.js --file ./seeds/items-safety.js
 *
 * E-6's finding was that almost all the counterplay ALREADY EXISTS — Forest Resin
 * (contact), Antiseptic Wash (tiers), Burn T2 (clears infection outright, §8.2).
 * The respirator is the one genuinely new object, and it is deliberately narrow:
 * it answers INHALATION only, which is the half that kills instantly (Infected +
 * Suffocation, §8.2). Contact is still the player's problem.
 *
 * Escalating scarcity on purpose: the Basic filter is bought, the Quality seal is
 * carved off the floor, the Superior one is a Floor 3 answer to the Reservoir.
 */

const uses = (n) => ({ max: n, current: n });
const SAFETY = (it) => ({ category: 'Consumables', subtype: 'Consumable', source: 'safety', boxTiers: [], themes: ['safety', 'crystal-plague'], ...it });

module.exports = [
  SAFETY({
    name: 'Cloth Filter Mask', icon: '😷', tier: 'Crude', uses: uses(3),
    specialEffects: 'One Clock of protection per use: inhaled Infection is prevented, and no Suffocation is started by breathing spores. Does NOTHING against contact. A use is spent the moment it is donned, not when it saves you.',
    description: 'Corporation issue. The strap is the good part.',
  }),
  SAFETY({
    name: 'Sealed Respirator', icon: '🥽', tier: 'Quality', subtype: 'Gear', uses: uses(0),
    category: 'Equipment',
    requirements: 'Physique 3 (the seal has to be held shut against your own breathing)',
    specialEffects: 'While worn: immune to INHALED Infection and to spore-borne Suffocation. Does NOTHING against contact — the crystal still takes any part it touches. Speech is muffled: skills requiring the voice cost +1 Moment.',
    description: 'Carved and stitched, not bought. Everyone who owned one before you also thought it would be enough.',
  }),
  SAFETY({
    name: 'Reservoir Seal', icon: '🫧', tier: 'Superior', subtype: 'Gear', uses: uses(0),
    category: 'Equipment',
    requirements: 'Physique 6 · Mind 4 (you have to keep working while it is on)',
    specialEffects: 'While worn: immune to inhaled Infection and spore Suffocation, AND the first CONTACT Infection each Clock is stopped at the hide. Speech is impossible — no spoken skills at all.',
    description: 'Mycelium-threaded hide over a respirator frame. Built for one room, by people who knew which room.',
    themes: ['safety', 'crystal-plague', 'floor-3'],
  }),
  SAFETY({
    name: 'Resin Coat', icon: '🍯', tier: 'Basic', uses: uses(2),
    specialEffects: 'Smear Forest Resin on skin and gear (1 Moment). The next CONTACT Infection this Clock grips the resin instead of you and peels away with it. One coat, one exposure — it does not stack and it does not help you breathe.',
    description: 'The forest sells the answer to the forest.',
    themes: ['safety', 'crystal-plague', 'floor-1'],
  }),
];
