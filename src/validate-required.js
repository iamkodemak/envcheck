/**
 * Validates that all required keys are present and non-empty in a parsed env object.
 * Combines required key checking with optional type/pattern hints from a schema.
 */

'use strict';

/**
 * @param {Record<string, string>} env - parsed env key/value pairs
 * @param {string[]} requiredKeys - list of keys that must be present
 * @returns {{ missing: string[], empty: string[], valid: boolean }}
 */
function validateRequired(env, requiredKeys) {
  const missing = [];
  const empty = [];

  for (const key of requiredKeys) {
    if (!(key in env)) {
      missing.push(key);
    } else if (env[key].trim() === '') {
      empty.push(key);
    }
  }

  return {
    missing,
    empty,
    valid: missing.length === 0 && empty.length === 0,
  };
}

module.exports = { validateRequired };
