/**
 * Interpolate variable references within .env values.
 * Supports ${VAR} and $VAR syntax.
 */

/**
 * Resolve a single value by expanding variable references.
 * @param {string} value
 * @param {Object} env - map of key -> value
 * @param {Set} [visiting] - tracks keys currently being resolved (cycle detection)
 * @returns {string}
 */
function resolveValue(value, env, visiting = new Set()) {
  if (typeof value !== 'string') return value;

  return value.replace(/\$\{([^}]+)\}|\$([A-Za-z_][A-Za-z0-9_]*)/g, (match, braced, bare) => {
    const key = braced || bare;
    if (visiting.has(key)) {
      throw new Error(`Circular reference detected for variable: ${key}`);
    }
    if (Object.prototype.hasOwnProperty.call(env, key)) {
      visiting.add(key);
      const resolved = resolveValue(env[key], env, visiting);
      visiting.delete(key);
      return resolved;
    }
    return match; // leave unresolved references as-is
  });
}

/**
 * Interpolate all values in an env object.
 * @param {Object} env - map of key -> raw value
 * @returns {{ result: Object, errors: string[] }}
 */
function interpolate(env) {
  const result = {};
  const errors = [];

  for (const key of Object.keys(env)) {
    try {
      result[key] = resolveValue(env[key], env);
    } catch (err) {
      errors.push(`${key}: ${err.message}`);
      result[key] = env[key];
    }
  }

  return { result, errors };
}

module.exports = { interpolate, resolveValue };
