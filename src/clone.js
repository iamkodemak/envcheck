/**
 * clone.js — Clone one .env file into another with optional key filtering and overrides
 */

/**
 * Clone entries from source env, optionally filtering keys and applying overrides.
 *
 * @param {Object} source - Parsed source env object { key: { value, comment } }
 * @param {Object} options
 * @param {string[]} [options.only]     - If set, only include these keys
 * @param {string[]} [options.exclude]  - Keys to exclude
 * @param {Object}  [options.overrides] - Key/value pairs to override in the clone
 * @returns {{ result: Object, skipped: string[], overridden: string[] }}
 */
function clone(source, { only = null, exclude = [], overrides = {} } = {}) {
  const result = {};
  const skipped = [];
  const overridden = [];

  for (const [key, entry] of Object.entries(source)) {
    if (only && !only.includes(key)) {
      skipped.push(key);
      continue;
    }
    if (exclude.includes(key)) {
      skipped.push(key);
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(overrides, key)) {
      result[key] = { value: overrides[key], comment: entry.comment ?? null };
      overridden.push(key);
    } else {
      result[key] = { ...entry };
    }
  }

  // Append any override keys that didn't exist in source
  for (const [key, value] of Object.entries(overrides)) {
    if (!Object.prototype.hasOwnProperty.call(result, key) && !skipped.includes(key)) {
      result[key] = { value, comment: null };
      overridden.push(key);
    }
  }

  return { result, skipped, overridden };
}

module.exports = { clone };
