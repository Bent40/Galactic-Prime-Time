/**
 * skill-fx.js — which visual effect a skill fires (owner ask, 2026-09-23: "skills
 * should auto-fire their damage type effect when used").
 *
 * The authored answer is `SkillTemplate.damageTypes` (§7.3's seven types). Most of
 * the 49 live templates were written before the field existed, so until the library
 * pass tags them, the type is READ OFF THE SKILL'S OWN TEXT — name, effect,
 * description — with the same vocabulary the book uses (fire/flame/burn → Burn,
 * frost/ice/cold → Chill, …). A skill that names no type fires the neutral `Skill`
 * burst, so nothing is silent. Dependency-free; `inferDamageTypes` is pure.
 */
const DMG_TYPES = ['Bleed', 'Crush', 'Burn', 'Chill', 'Poison', 'Infection', 'Dissolution'];
const NEUTRAL = 'Skill';
const HEAL = 'Heal';

// Order matters only for ties; the first two hits fire (a torch that also cuts).
const WORDS = [
  ['Burn',        /\b(burn|burns|burning|fire|flame|flames|ember|embers|ignite|scorch|blaze|torch|incinerat\w*)\b/i],
  ['Chill',       /\b(chill|chilled|frost|ice|icy|cold|freeze|frozen|snow)\b/i],
  ['Bleed',       /\b(bleed|bleeding|slash|slice|cut|cuts|claw|claws|blade|bite|bites|fang|fangs|pierce|stab)\b/i],
  ['Crush',       /\b(crush|crushed|smash|slam|blunt|hammer|punch|punches|kick|stomp|tackle|bludgeon|pound)\b/i],
  ['Poison',      /\b(poison|poisoned|venom|toxic|toxin)\b/i],
  ['Infection',   /\b(infect\w*|plague|disease|spore|spores|rot)\b/i],
  ['Dissolution', /\b(dissolution|dissolve|unmake|unravel|psychic|terror|dread|madness)\b/i],
];
const HEAL_WORDS = /\b(heal|heals|healing|mend|mends|triage|bandage|restore|restores|cure|cures)\b/i;

/** Coerce an authored list to the seven types, deduplicated, in the given order. */
function normDamageTypes(arr) {
  if (!Array.isArray(arr)) return [];
  const out = [];
  for (const t of arr) { const s = String(t || '').trim(); const hit = DMG_TYPES.find(d => d.toLowerCase() === s.toLowerCase()); if (hit && !out.includes(hit)) out.push(hit); }
  return out;
}

/**
 * The effect types a skill fires, at most two. Authored `damageTypes` win outright;
 * otherwise the text decides; a heal-shaped skill with no damage word fires Heal; a
 * skill with no match fires the neutral burst.
 */
function inferDamageTypes(tpl = {}) {
  const authored = normDamageTypes(tpl.damageTypes);
  if (authored.length) return authored.slice(0, 2);
  const text = [tpl.name, tpl.effect, tpl.description].filter(Boolean).join(' ');
  const hits = WORDS.filter(([, re]) => re.test(text)).map(([t]) => t);
  if (hits.length) return hits.slice(0, 2);
  if (HEAL_WORDS.test(text)) return [HEAL];
  return [NEUTRAL];
}

module.exports = { DMG_TYPES, NEUTRAL, HEAL, normDamageTypes, inferDamageTypes };
