/**
 * Materials — F1 Forest band (×2) as grantable inventory items (carve/gather
 * yields). BLESSED with the materials catalog (rulebook/item-drafting-materials.md
 * M-1). Seed via: node seed-items.js --file ./seeds/items-materials-f1.js
 *
 * Materials have no item tier (they ARE the power axis — tier stays blank).
 * Inherent effects are public knowledge; they apply when the material is
 * crafted/reforged into a part (passover ID-8), one effect per socket.
 *
 * REQUIREMENTS (level-budget L-14, added 2026-08-25). §12.1's old ceiling of 5 is
 * LIFTED: an item may demand any amount of any trait. A material's requirement
 * RIDES ALONG into whatever it is crafted into — the trait buys the right to hold
 * the thing, never extra damage. F1 numbers are deliberately small (a focused build
 * enters Floor 1 with ~14 total points), except Mistletoe, which is the proof that
 * the ceiling is gone and the first hint that endgame gear will ask for absurdities.
 */

const MAT = (it) => ({ category: 'Misc', subtype: 'Material', tier: '', source: 'materials-f1', boxTiers: [], themes: ['floor-1', 'material-band'], ...it });

module.exports = [
  MAT({ name: 'Oak Heartwood', requirements: 'Physique 2 — dense, and it does not care that you are tired.', icon: '🪵',
    specialEffects: 'F1 Forest band (x2). Inherent: Sturdy — the item ignores its first breakage/degrade per floor.' }),
  MAT({ name: 'Beastbone', requirements: 'Physique 3 — the edge is bone, so it is you that has to be sharp.', icon: '🦴',
    specialEffects: 'F1 Forest band (x2). Inherent: Vicious — +1 Bleed rider on the item\'s damage.' }),
  MAT({ name: 'Sinew Cord', requirements: 'Reflexes 3 — taut enough that a slow hand loses fingers.', icon: '🧵',
    specialEffects: 'F1 Forest band (x2). Inherent: Taut — +1 range on thrown/line attacks, or a grip that cannot be disarmed.' }),
  MAT({ name: 'Tough Hide', requirements: 'Physique 3 — worn, not carried.', icon: '🟤',
    specialEffects: 'F1 Forest band (x2). Inherent: Warding — 1 flat Bleed resist when used in armor parts.' }),
  MAT({ name: 'Forest Resin', icon: '🍯',
    specialEffects: 'F1 Forest band (x2). Inherent: Clinging — on-hit, target\'s next free-move costs a Moment (once per Clock). Also a consumable-crafting ingredient.' }),
  MAT({ name: 'Mistletoe Sprig', requirements: 'Charm 8 ⭐ — Oathbreaker is a CLAIM, not an edge. It cuts what is warded because you are owed the cut, and a contestant nobody would side with is holding a sprig. FIRST ITEM IN THE GAME TO ASK FOR MORE THAN 5 (L-14).', icon: '🌿',
    specialEffects: 'F1 Forest band (x2), RARE. Inherent: Oathbreaker — damages creatures immune or warded against normal harm.',
    description: 'The one thing unsworn.' }),
  MAT({ name: 'Obsidian Shard', requirements: 'Reflexes 4 — it chips, and the chips go somewhere.', icon: '🖤',
    specialEffects: 'F1 Forest band (x2), RARE. Inherent: Razor-edge — +1 damage, but the part chips on an attack roll of 1 (GM).' }),
  MAT({ name: 'Lotus Root', icon: '🪷',
    specialEffects: 'Consumable-crafting ingredient (no band): limb- and body-restoration consumables at the Lounge (Farm/Med Bay adjacent).',
    description: 'A whole body was rebuilt from this, once.' }),
  MAT({ name: 'Mycelium-Threaded Hide', requirements: 'Physique 5 · Mind 3 — it reattaches to itself, including across your arm, and you have to notice.', icon: '🍄',
    specialEffects: 'Boss carve — the Incineradile. F1 band (x2). Inherent: Fire-fed — armor parts made of it convert 1 incoming Burn per hit to nothing.',
    description: 'It reattaches to itself if you store it wrong.',
    themes: ['floor-1', 'material-band', 'incineradile'] }),
];
