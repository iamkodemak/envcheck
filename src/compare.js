/**
 * compare.js — compare two .env files and produce a structured report
 * of keys that are missing, extra, or have differing values.
 */

/**
 * @typedef {{ missing: string[], extra: string[], changed: Array<{key: string, base: string, target: string}>, matching: string[] }} CompareResult
 */

/**
 * Compare a base env object against a target env object.
 * @param {Record<string, string>} base
 * @param {Record<string, string>} target
 * @returns {CompareResult}
 */
function compare(base, target) {
  const baseKeys = new Set(Object.keys(base));
  const targetKeys = new Set(Object.keys(target));

  const missing = [...baseKeys].filter((k) => !targetKeys.has(k));
  const extra = [...targetKeys].filter((k) => !baseKeys.has(k));

  const changed = [];
  const matching = [];

  for (const key of baseKeys) {
    if (!targetKeys.has(key)) continue;
    if (base[key] !== target[key]) {
      changed.push({ key, base: base[key], target: target[key] });
    } else {
      matching.push(key);
    }
  }

  return { missing, extra, changed, matching };
}

module.exports = { compare };
