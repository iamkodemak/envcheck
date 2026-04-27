/**
 * pluck.js — extract specific keys from a parsed env object
 */

/**
 * Pluck selected keys from an env object.
 * @param {Record<string, string>} env - parsed env key/value pairs
 * @param {string[]} keys - keys to pluck
 * @param {object} [options]
 * @param {boolean} [options.strict] - throw if a key is missing
 * @returns {{ result: Record<string, string>, missing: string[] }}
 */
function pluck(env, keys, options = {}) {
  const { strict = false } = options;
  const result = {};
  const missing = [];

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(env, key)) {
      result[key] = env[key];
    } else {
      missing.push(key);
      if (strict) {
        throw new Error(`Missing required key: ${key}`);
      }
    }
  }

  return { result, missing };
}

module.exports = { pluck };
