/**
 * defaults.js
 * Fill missing keys in a target .env using values from a source/defaults file.
 */

/**
 * @param {Record<string,string>} source - default values
 * @param {Record<string,string>} target - target env (may be missing keys)
 * @param {object} [options]
 * @param {boolean} [options.overwrite=false] - overwrite existing keys in target
 * @returns {{ result: Record<string,string>, added: string[], skipped: string[] }}
 */
function applyDefaults(source, target, options = {}) {
  const { overwrite = false } = options;
  const result = { ...target };
  const added = [];
  const skipped = [];

  for (const [key, value] of Object.entries(source)) {
    if (overwrite || !(key in result)) {
      if (key in result && overwrite) {
        skipped.push(key); // was present but overwritten — track as skipped from "missing" perspective
      }
      result[key] = value;
      added.push(key);
    } else {
      skipped.push(key);
    }
  }

  return { result, added, skipped };
}

module.exports = { applyDefaults };
