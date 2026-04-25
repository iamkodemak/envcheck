/**
 * split.js — split a .env file into multiple files by prefix or group
 */

/**
 * Split env vars into groups based on key prefix.
 * @param {Object} env - parsed env object { key: { value, comment } }
 * @param {string[]} prefixes - list of prefixes to split on (e.g. ['DB_', 'AWS_'])
 * @param {Object} options
 * @param {boolean} options.stripPrefix - remove the prefix from keys in output
 * @returns {Object} map of prefix -> env subset, plus 'other' for unmatched
 */
export function split(env, prefixes, options = {}) {
  const { stripPrefix = false } = options;
  const result = {};

  for (const prefix of prefixes) {
    result[prefix] = {};
  }
  result['other'] = {};

  for (const [key, entry] of Object.entries(env)) {
    const matched = prefixes.find(p => key.startsWith(p));
    if (matched) {
      const outKey = stripPrefix ? key.slice(matched.length) : key;
      result[matched][outKey] = entry;
    } else {
      result['other'][key] = entry;
    }
  }

  // Remove empty groups
  for (const key of Object.keys(result)) {
    if (Object.keys(result[key]).length === 0) {
      delete result[key];
    }
  }

  return result;
}
