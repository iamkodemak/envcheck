/**
 * Sorts parsed env entries by key, optionally grouping by prefix.
 */

/**
 * Sort env object keys alphabetically.
 * @param {Object} env - Parsed env object { KEY: value }
 * @param {Object} options
 * @param {boolean} options.groupByPrefix - Group keys by their prefix (e.g. DB_, APP_)
 * @returns {{ sorted: Object, groups: Object|null }}
 */
function sort(env, options = {}) {
  const { groupByPrefix = false } = options;

  const keys = Object.keys(env);
  const sortedKeys = [...keys].sort((a, b) => a.localeCompare(b));

  const sorted = {};
  for (const key of sortedKeys) {
    sorted[key] = env[key];
  }

  if (!groupByPrefix) {
    return { sorted, groups: null };
  }

  const groups = {};
  for (const key of sortedKeys) {
    const underscoreIndex = key.indexOf('_');
    const prefix = underscoreIndex > 0 ? key.slice(0, underscoreIndex) : '__UNGROUPED__';
    if (!groups[prefix]) {
      groups[prefix] = {};
    }
    groups[prefix][key] = env[key];
  }

  return { sorted, groups };
}

module.exports = { sort };
