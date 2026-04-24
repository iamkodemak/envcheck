/**
 * Flatten nested env-like objects into dot-notation keys.
 * Also supports unflattening dot-notation keys back into nested objects.
 */

/**
 * Flatten a nested object into dot-notation key/value pairs.
 * @param {Record<string, any>} obj
 * @param {string} prefix
 * @returns {Record<string, string>}
 */
function flatten(obj, prefix = '') {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flatten(value, fullKey));
    } else {
      result[fullKey] = String(value ?? '');
    }
  }

  return result;
}

/**
 * Unflatten dot-notation key/value pairs back into a nested object.
 * @param {Record<string, string>} flat
 * @returns {Record<string, any>}
 */
function unflatten(flat) {
  const result = {};

  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.');
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current) || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }

    current[parts[parts.length - 1]] = value;
  }

  return result;
}

module.exports = { flatten, unflatten };
