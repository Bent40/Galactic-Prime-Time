/**
 * test-skill-fx.js — which effect a skill fires. Authored `damageTypes` win; otherwise the
 * type is read off the skill's own text; a heal fires Heal; nothing matched fires the
 * neutral Skill burst. Dependency-free. Run:  node test-skill-fx.js
 */
const { inferDamageTypes, normDamageTypes, DMG_TYPES } = require('./skill-fx');
let pass = 0, fail = 0;
const eq = (label, got, want) => { if (JSON.stringify(got) === JSON.stringify(want)) pass++; else { fail++; console.log(`  ✗ ${label} — got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`); } };

eq('authored types win', inferDamageTypes({ name: 'Fire Ball', damageTypes: ['Chill'] }), ['Chill']);
eq('authored types are capped at two', inferDamageTypes({ name: 'x', damageTypes: ['Bleed', 'Crush', 'Burn'] }), ['Bleed', 'Crush']);
eq('Fire Ball → Burn', inferDamageTypes({ name: 'Fire Ball', effect: 'Hurl a ball of flame.' }), ['Burn']);
eq('Ember Breath → Burn', inferDamageTypes({ name: 'Ember Breath' }), ['Burn']);
eq('Frost Wall → Chill', inferDamageTypes({ name: 'Frost Wall', effect: 'A wall of ice.' }), ['Chill']);
eq("Slice n' Dice → Bleed", inferDamageTypes({ name: "Slice n' Dice", effect: 'Two quick cuts with the forepaws.' }), ['Bleed']);
eq('Heroic Punch → Crush', inferDamageTypes({ name: 'Heroic Punch', effect: 'A wind-up punch.' }), ['Crush']);
eq('Poison Wall → Poison', inferDamageTypes({ name: 'Poison Wall', effect: 'A lingering toxic cloud.' }), ['Poison']);
eq('a plague skill → Infection', inferDamageTypes({ name: 'Spore Puff', effect: 'Infects the part it touches.' }), ['Infection']);
eq('a psychic skill → Dissolution', inferDamageTypes({ name: 'Mockery', effect: 'A psychic jab that unravels resolve.' }), ['Dissolution']);
eq('two words → two types, in vocabulary order', inferDamageTypes({ name: 'Flaming Claws', effect: 'burning cuts' }), ['Burn', 'Bleed']);
eq('Field Triage → Heal', inferDamageTypes({ name: 'Field Triage', effect: 'Bandage a wound; delays one condition.' }), ['Heal']);
eq('no damage word → neutral Skill', inferDamageTypes({ name: 'Camouflage', effect: 'Blend into the terrain.' }), ['Skill']);
eq('Swim → neutral Skill', inferDamageTypes({ name: 'Swim', effect: 'Move through water at full speed.' }), ['Skill']);
eq('word boundaries: "cutscene" is not a cut', inferDamageTypes({ name: 'Play to the Camera', effect: 'A cutscene moment for the audience.' }), ['Skill']);
eq('empty template → neutral', inferDamageTypes({}), ['Skill']);
eq('normDamageTypes coerces case and drops junk', normDamageTypes(['burn', 'Lightning', 'BLEED', 'burn']), ['Burn', 'Bleed']);
eq('normDamageTypes on non-array', normDamageTypes('Burn'), []);
eq('DMG_TYPES are the seven', DMG_TYPES.length, 7);

console.log(`\ntest-skill-fx: ${pass} pass · ${fail} fail`);
process.exit(fail ? 1 : 0);
