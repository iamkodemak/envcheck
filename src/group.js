/**
 * Groups env variables by a common prefix delimiter.
 * e.g. DB_HOST, DB_PORT => { DB: { HOST: '...', PORT: '...' } }
 */

/**
 * @param {Record<string, string>} env
 * @param {string} [delimiter='_']
 * @returns {Record<string, Record<string, string>>}
 */
function group(env, delimiter = '_') {
  const result = {};

  for (const [key, value] of Object.entries(env)) {
    const idx = key.indexOf(delimiter);

    if (idx === -1) {
      const ungrouped = result['__ungrouped__'] || {};
      ungrouped[key] = value;
      result['__ungrouped__'] = ungrouped;
    } else {
      const prefix = key.slice(0, idx);
      const rest = key.slice(idx + 1);
      if (!result[prefix]) {
        result[prefix] = {};
      }
      result[prefix][rest] = value;
    }
  }

  return result;
}

/**
 * Flattens a grouped env object back to a flat key/value map.
 * @param {Record<string, Record<string, string>>} grouped
 * @param {string} [delimiter='_']
 * @returns {Record<string, string>}
 */
function ungroup(grouped, delimiter = '_') {
  const result = {};

  for (const [prefix, entries] of Object.entries(grouped)) {
    if (prefix === '__ungrouped__') {
      Object.assign(result, entries);
    } else {
      for (const [subKey, value] of Object.entries(entries)) {
        result[`${prefix}${delimiter}${subKey}`] = value;
      }
    }
  }

  return result;
}

module.exports = { group, ungroup };
