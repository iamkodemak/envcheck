/**
 * promote.js
 * Copy/promote env vars from one environment file to another,
 * optionally filtering by key prefix or explicit key list.
 */

/**
 * @param {Record<string,string>} source  - parsed source env
 * @param {Record<string,string>} target  - parsed target env
 * @param {object} options
 * @param {string[]} [options.keys]        - explicit keys to promote
 * @param {string}  [options.prefix]       - promote keys matching this prefix
 * @param {boolean} [options.overwrite]    - overwrite existing keys in target (default true)
 * @returns {{ result: Record<string,string>, promoted: string[], skipped: string[] }}
 */
function promote(source, target, options = {}) {
  const { keys, prefix, overwrite = true } = options;

  let candidates = Object.keys(source);

  if (keys && keys.length > 0) {
    candidates = candidates.filter((k) => keys.includes(k));
  } else if (prefix) {
    candidates = candidates.filter((k) => k.startsWith(prefix));
  }

  const result = { ...target };
  const promoted = [];
  const skipped = [];

  for (const key of candidates) {
    if (!overwrite && Object.prototype.hasOwnProperty.call(target, key)) {
      skipped.push(key);
      continue;
    }
    result[key] = source[key];
    promoted.push(key);
  }

  return { result, promoted, skipped };
}

module.exports = { promote };
