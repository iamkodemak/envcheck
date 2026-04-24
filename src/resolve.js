/**
 * resolve.js — resolves missing keys in a target .env by pulling values from a source .env
 */

/**
 * @param {Record<string, string>} source - the reference env (e.g. .env.example)
 * @param {Record<string, string>} target - the env to be resolved
 * @param {object} options
 * @param {boolean} [options.onlyMissing=true] - only fill keys missing in target
 * @param {boolean} [options.overwrite=false] - overwrite existing keys in target
 * @returns {{ resolved: Record<string, string>, added: string[], skipped: string[] }}
 */
function resolve(source, target, options = {}) {
  const { onlyMissing = true, overwrite = false } = options;

  const resolved = { ...target };
  const added = [];
  const skipped = [];

  for (const key of Object.keys(source)) {
    const existsInTarget = Object.prototype.hasOwnProperty.call(target, key);

    if (existsInTarget && !overwrite) {
      skipped.push(key);
      continue;
    }

    if (onlyMissing && existsInTarget) {
      skipped.push(key);
      continue;
    }

    resolved[key] = source[key];
    added.push(key);
  }

  return { resolved, added, skipped };
}

module.exports = { resolve };
