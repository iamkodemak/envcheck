/**
 * Merge multiple parsed .env objects into one.
 * Later sources win on key conflicts.
 * Returns merged object plus metadata about conflicts.
 */

/**
 * @param {...Object} envObjects - parsed env key/value maps
 * @returns {{ merged: Object, conflicts: Object }}
 *   conflicts: { KEY: [val1, val2, ...] } for keys with differing values
 */
function merge(...envObjects) {
  const merged = {};
  const seen = {}; // KEY -> array of all values encountered

  for (const env of envObjects) {
    for (const [key, value] of Object.entries(env)) {
      if (!seen[key]) {
        seen[key] = [];
      }
      seen[key].push(value);
      merged[key] = value;
    }
  }

  const conflicts = {};
  for (const [key, values] of Object.entries(seen)) {
    const unique = [...new Set(values)];
    if (unique.length > 1) {
      conflicts[key] = values;
    }
  }

  return { merged, conflicts };
}

module.exports = { merge };
