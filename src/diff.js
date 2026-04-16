/**
 * Compares two parsed .env objects and returns a structured diff.
 * @param {Object} base - The base environment (e.g. .env.example)
 * @param {Object} target - The target environment (e.g. .env)
 * @returns {Object} diff result with missing, extra, and changed keys
 */
function diff(base, target) {
  const baseKeys = new Set(Object.keys(base));
  const targetKeys = new Set(Object.keys(target));

  const missing = [];
  const extra = [];
  const changed = [];
  const matching = [];

  for (const key of baseKeys) {
    if (!targetKeys.has(key)) {
      missing.push({ key, baseValue: base[key] });
    } else if (base[key] !== target[key]) {
      changed.push({ key, baseValue: base[key], targetValue: target[key] });
    } else {
      matching.push(key);
    }
  }

  for (const key of targetKeys) {
    if (!baseKeys.has(key)) {
      extra.push({ key, targetValue: target[key] });
    }
  }

  return {
    missing,
    extra,
    changed,
    matching,
    hasDiff: missing.length > 0 || extra.length > 0 || changed.length > 0,
  };
}

module.exports = { diff };
