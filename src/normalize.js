/**
 * normalize.js
 * Normalize .env values: trim whitespace, unquote strings, lowercase/uppercase keys, etc.
 */

/**
 * @param {Record<string, string>} env
 * @param {object} options
 * @param {'upper'|'lower'|'none'} [options.keys='none'] - Transform key casing
 * @param {boolean} [options.trimValues=true] - Trim whitespace from values
 * @param {boolean} [options.unquote=true] - Strip surrounding quotes from values
 * @returns {{ normalized: Record<string, string>, changes: Array<{key: string, from: string, to: string, reason: string}> }}
 */
function normalize(env, options = {}) {
  const {
    keys = 'none',
    trimValues = true,
    unquote = true,
  } = options;

  const normalized = {};
  const changes = [];

  for (const [rawKey, rawValue] of Object.entries(env)) {
    let key = rawKey;
    let value = rawValue;

    // Normalize key casing
    if (keys === 'upper' && key !== key.toUpperCase()) {
      const newKey = key.toUpperCase();
      changes.push({ key: rawKey, from: key, to: newKey, reason: 'key uppercased' });
      key = newKey;
    } else if (keys === 'lower' && key !== key.toLowerCase()) {
      const newKey = key.toLowerCase();
      changes.push({ key: rawKey, from: key, to: newKey, reason: 'key lowercased' });
      key = newKey;
    }

    // Trim value whitespace
    if (trimValues && value !== value.trim()) {
      const trimmed = value.trim();
      changes.push({ key, from: value, to: trimmed, reason: 'value trimmed' });
      value = trimmed;
    }

    // Unquote value
    if (unquote) {
      const unquoted = stripQuotes(value);
      if (unquoted !== value) {
        changes.push({ key, from: value, to: unquoted, reason: 'quotes removed' });
        value = unquoted;
      }
    }

    normalized[key] = value;
  }

  return { normalized, changes };
}

/**
 * Strip matching surrounding single or double quotes from a string.
 * @param {string} value
 * @returns {string}
 */
function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

module.exports = { normalize, stripQuotes };
