/**
 * reorder.js — reorder keys in a parsed .env object based on a provided key list
 */

/**
 * Reorder keys in an env object.
 *
 * Keys listed in `order` come first (in that order).
 * Remaining keys are appended in their original relative order.
 * Keys in `order` that don't exist in `env` are silently skipped.
 *
 * @param {Record<string, string>} env - parsed env object
 * @param {string[]} order - desired key order
 * @param {object} [options]
 * @param {boolean} [options.appendRemaining=true] - whether to append keys not in order
 * @returns {Record<string, string>}
 */
function reorder(env, order = [], options = {}) {
  const { appendRemaining = true } = options;

  if (typeof env !== 'object' || env === null) {
    throw new TypeError('env must be a non-null object');
  }

  if (!Array.isArray(order)) {
    throw new TypeError('order must be an array');
  }

  const result = {};

  // Add keys in specified order (only if they exist in env)
  for (const key of order) {
    if (Object.prototype.hasOwnProperty.call(env, key)) {
      result[key] = env[key];
    }
  }

  if (appendRemaining) {
    // Append remaining keys not already placed
    const placed = new Set(order);
    for (const key of Object.keys(env)) {
      if (!placed.has(key)) {
        result[key] = env[key];
      }
    }
  }

  return result;
}

module.exports = { reorder };
