/**
 * required.js
 * Checks that all required keys are present and non-empty in a parsed env object.
 */

/**
 * @param {Record<string, string>} env - parsed env key/value pairs
 * @param {string[]} requiredKeys - list of keys that must be present and non-empty
 * @returns {{ missing: string[], empty: string[] }}
 */
function required(env, requiredKeys) {
  const missing = [];
  const empty = [];

  for (const key of requiredKeys) {
    if (!(key in env)) {
      missing.push(key);
    } else if (env[key] === '' || env[key] === null || env[key] === undefined) {
      empty.push(key);
    }
  }

  return { missing, empty };
}

module.exports = { required };
