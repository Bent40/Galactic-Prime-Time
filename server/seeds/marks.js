/**
 * MARKS — rulebook §18.4.
 *
 * A Mark is a tag that records a DEED rather than a performance. It is granted
 * automatically by the act, never fades, and cannot be shed. It lies dormant
 * until a scene makes it relevant, at which point the brand wakes.
 *
 * These are the three the book names. The campaign roster (the Set 1 deed
 * sweep — 22 deeds across F1–F3) is GM material and deliberately NOT published
 * here: a Mark's whole function is that the name arrives before its referent.
 *
 *   description — trope-level. Safe for a player to read.
 *   conditions  — the deed that grants it. Also trope-level, no campaign nouns.
 *   activeNear  — the presence trigger, in prose. Shown on the sheet.
 *   effect      — what having it does. Kept deliberately open; a Mark opens
 *                 interactions, it does not hand out a bonus.
 */
module.exports = [
  {
    name: 'Regicide',
    kind: 'mark',
    description: 'You killed a reigning monarch. Whether you knew it at the time is not relevant to the fact.',
    conditions: 'Kill a reigning monarch, knowingly or otherwise.',
    activeNear: 'Crowns, thrones, and the machinery of rule',
    effect: 'Permanent. Rule and its instruments respond to you, and not always in ways you can trace.',
  },
  {
    name: 'Dragon Slayer',
    kind: 'mark',
    description: 'You killed a dragon, or one of its kin. Very few things in the world have.',
    conditions: 'Kill a dragon or one of its kin.',
    activeNear: 'Dragons and their kin — and anything that wants what they are made of',
    effect: 'Permanent. It tells anything that knows what a dragon is worth that you have handled one.',
  },
  {
    name: 'Witness',
    kind: 'mark',
    description: 'You saw a thing happen and you did not stop it. The Show recorded that you were there.',
    conditions: 'Be present for something significant and take no action to prevent it.',
    activeNear: 'Whoever else was there, and whoever recognises what you saw',
    effect: 'Permanent. Some doors open to a witness. Others close, and stay closed.',
  },
];
