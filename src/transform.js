/**
 * Transform .env values using built-in or custom transformers.
 */

const transformers = {
  uppercase: (val) => val.toUpperCase(),
  lowercase: (val) => val.toLowerCase(),
  trim: (val) => val.trim(),
  mask: (val) => val.length > 4 ? val.slice(0, 2) + '*'.repeat(val.length - 4) + val.slice(-2) : '****',
  boolean: (val) => {
    const t = val.trim().toLowerCase();
    if (['true', '1', 'yes'].includes(t)) return 'true';
    if (['false', '0', 'no'].includes(t)) return 'false';
    return val;
  },
};

/**
 * Apply a list of transform operations to a parsed env object.
 * @param {Record<string, string>} env
 * @param {Array<{key: string|'*', transform: string}>} ops
 * @returns {{ result: Record<string, string>, warnings: string[] }}
 */
function transform(env, ops) {
  const result = { ...env };
  const warnings = [];

  for (const op of ops) {
    const fn = transformers[op.transform];
    if (!fn) {
      warnings.push(`Unknown transformer: "${op.transform}"`);
      continue;
    }

    if (op.key === '*') {
      for (const k of Object.keys(result)) {
        result[k] = fn(result[k]);
      }
    } else if (result[op.key] !== undefined) {
      result[op.key] = fn(result[op.key]);
    } else {
      warnings.push(`Key not found for transform: "${op.key}"`);
    }
  }

  return { result, warnings };
}

module.exports = { transform, transformers };
