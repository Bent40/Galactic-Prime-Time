/**
 * The HIGHER affix tier (rulebook/item-drafting-higher-affixes.md — PROPOSED,
 * sync to trims before applying). Consumed by seed-affixes.js.
 * Catalog voice matches the live affixes: short effects, "Applicable to:" in
 * the description.
 */

const P = (name, effects, appl) => ({ name, type: 'prefix', tier: 'Higher', effects, description: `Applicable to: ${appl}` });
const S = (name, effects, appl) => ({ name, type: 'suffix', tier: 'Higher', effects, description: `Applicable to: ${appl}` });

module.exports = [
  // ——— prefixes ———
  P('Serrated III', '+3 Bleed Damage', 'Bladed Weapons'),
  P('Weighted III', '+3 Crush Damage', 'Any'),
  P('Chilling II', 'Tier 2 Chilled on hit', 'Any'),
  P('Venomous II', 'Tier 2 Poison (Neurotoxin) on hit', 'Any'),
  P('Searing', 'Tier 2 Burn on hit', 'Any'),
  P('Rending', "Hits reduce the struck part's flat resistance by 1 until the Clock resets (stacks to 3)", 'Weapons'),
  P('Concussive', "Once per Clock: a Crush hit makes the target's next action cost +1 Moment", 'Crush Weapons'),
  P('Thornguard', 'Attackers striking the covered part take 2 Bleed', 'Armors, Shields'),
  // ——— suffixes ———
  S('Spanning', '+3 Range', 'Weapons'),
  S('Featherlight', 'Requires half the Physique to use', 'Any'),
  S('Swift II', "Twice per Clock, an action resolves as if done 1 Moment sooner. The user still waits until the Moment's end. Replaces Swift - never alongside it", 'Any'),
  S('Penetrating II', 'Ignores 3 Physical Resist', 'Any'),
  S('Anchored', 'The wielder cannot be involuntarily moved and always counts as on steady ground', 'Weapons, Armors'),
  S('Warded', 'The first condition (Tier 2 or lower) applied to the wearer each Clock is ignored', 'Armors, Shields'),
  S('Fluid', 'Once per Clock, one action costs 1 less Moment (minimum 1). Incompatible with Sharpened II and Balanced', 'Any'),
];
