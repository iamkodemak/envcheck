/**
 * prefix.js — add or remove a prefix from env variable keys
 */

/**
 * Add a prefix to all keys in an env object.
 * @param {Record<string, string>} env
 * @param {string} prefix
 * @returns {Record<string, string>}
 */
function addPrefix(env, prefix) {
  if (!prefix) return { ...env };
  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => [`${prefix}${key}`, value])
  );
}

/**
 * Remove a prefix from all keys that have it.
 * Keys without the prefix are left unchanged unless `strict` is true,
 * in which case they are dropped.
 * @param {Record<string, string>} env
 * @param {string} prefix
 * @param {{ strict?: boolean }} options
 * @returns {Record<string, string>}
 */
function removePrefix(env, prefix, { strict = false } = {}) {
  if (!prefix) return { ...env };
  const result = {};
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith(prefix)) {
      result[key.slice(prefix.length)] = value;
    } else if (!strict) {
      result[key] = value;
    }
  }
  return result;
}

module.exports = { addPrefix, removePrefix };
