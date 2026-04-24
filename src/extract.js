/**
 * extract.js — Extract a subset of keys from a .env file
 */

/**
 * Extract specified keys from a parsed env object.
 * @param {Object} env - Parsed env key/value pairs
 * @param {string[]} keys - Keys to extract
 * @param {Object} options
 * @param {boolean} options.strict - Throw if a requested key is missing
 * @returns {{ extracted: Object, missing: string[] }}
 */
function extract(env, keys, options = {}) {
  const { strict = false } = options;
  const extracted = {};
  const missing = [];

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(env, key)) {
      extracted[key] = env[key];
    } else {
      missing.push(key);
      if (strict) {
        throw new Error(`Key not found in env: ${key}`);
      }
    }
  }

  return { extracted, missing };
}

module.exports = { extract };
