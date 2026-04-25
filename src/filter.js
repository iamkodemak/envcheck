/**
 * filter.js — filter env entries by key pattern or value pattern
 */

/**
 * @param {Record<string, string>} env
 * @param {object} options
 * @param {string|RegExp} [options.keyPattern]   — filter by key
 * @param {string|RegExp} [options.valuePattern] — filter by value
 * @param {boolean}       [options.invert]       — invert the match (exclude)
 * @returns {Record<string, string>}
 */
function filter(env, options = {}) {
  const { keyPattern, valuePattern, invert = false } = options;

  if (!keyPattern && !valuePattern) {
    return { ...env };
  }

  const toRegex = (pattern) => {
    if (!pattern) return null;
    if (pattern instanceof RegExp) return pattern;
    return new RegExp(pattern);
  };

  const keyRe = toRegex(keyPattern);
  const valRe = toRegex(valuePattern);

  const result = {};

  for (const [key, value] of Object.entries(env)) {
    const keyMatch = keyRe ? keyRe.test(key) : true;
    const valMatch = valRe ? valRe.test(value) : true;
    const matched = keyMatch && valMatch;

    if (invert ? !matched : matched) {
      result[key] = value;
    }
  }

  return result;
}

module.exports = { filter };
