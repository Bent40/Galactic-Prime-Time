const SkillTemplate = require('../models/SkillTemplate');

const TRAIT_KEYS = ['physique', 'reflexes', 'mind', 'charm'];

/**
 * Joins template fields onto skill instances for API responses.
 * Orphaned/legacy skills (no templateId) are returned as-is.
 */
async function enrichSkills(skills) {
  if (!skills || skills.length === 0) return skills || [];

  const templateIds = skills.map(s => s.templateId).filter(Boolean);
  const tplMap = {};
  if (templateIds.length > 0) {
    const templates = await SkillTemplate.find({ _id: { $in: templateIds } }).lean();
    templates.forEach(t => { tplMap[String(t._id)] = t; });
  }

  return skills.map(sk => {
    const tpl = sk.templateId ? tplMap[String(sk.templateId)] : null;
    if (!tpl) return sk; // orphaned/legacy: pass through untouched

    return {
      id: sk.id,
      templateId: sk.templateId,
      level: sk.level || 0,
      capacity: sk.capacity ?? (tpl.capacity || 5),
      cooldownRemaining: sk.cooldownRemaining || 0,
      traitCosts: sk.traitCosts || [],
      // Template-derived display fields
      name: tpl.name,
      momentCost: tpl.momentCost || '',
      stats: tpl.stats || [],
      passive: !!tpl.passive,
      requirements: tpl.requirements || '',
      range: tpl.range || '',
      target: tpl.target || '',
      effect: tpl.effect || '',
      description: tpl.description || '',
      levelEffects: tpl.levelEffects || {},
    };
  });
}

/**
 * Strips template-derived fields from skills before saving to DB.
 * Reference-based skills keep only instance fields.
 * Legacy/manual skills (no templateId) keep their inline fields.
 */
function normalizeSkills(skills) {
  if (!Array.isArray(skills)) return [];
  return skills.map(sk => {
    if (sk.templateId) {
      return {
        id: sk.id,
        templateId: sk.templateId,
        level: sk.level || 0,
        capacity: sk.capacity ?? 5,
        cooldownRemaining: sk.cooldownRemaining || 0,
        traitCosts: sk.traitCosts || [],
      };
    }
    // Legacy/manual skill without a template ref — preserve inline fields
    return {
      id: sk.id,
      name: sk.name || '',
      momentCost: sk.momentCost || '',
      stats: sk.stats || [],
      passive: !!sk.passive,
      capacity: sk.capacity || 5,
      level: sk.level || 0,
      requirements: sk.requirements || '',
      range: sk.range || '',
      target: sk.target || '',
      effect: sk.effect || '',
      description: sk.description || '',
      levelEffects: sk.levelEffects || {},
      traitCosts: sk.traitCosts || [],
    };
  });
}

/**
 * Normalizes traits to the consolidated { base, bonus, levelBonus } format.
 * Handles both old format (three separate flat objects) and new nested format.
 */
function normalizeTraits(traits, legacyBonus, legacyLevelBonus) {
  const result = {};
  for (const t of TRAIT_KEYS) {
    const val = traits?.[t];
    if (val !== null && val !== undefined && typeof val === 'object' && !Array.isArray(val)) {
      // Already new format
      result[t] = { base: val.base || 0, bonus: val.bonus || 0, levelBonus: val.levelBonus || 0 };
    } else {
      // Old flat format — assemble from three separate objects
      result[t] = {
        base: val || 0,
        bonus: legacyBonus?.[t] || 0,
        levelBonus: legacyLevelBonus?.[t] || 0,
      };
    }
  }
  return result;
}

module.exports = { enrichSkills, normalizeSkills, normalizeTraits };
