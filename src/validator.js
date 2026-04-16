/**
 * Validates parsed .env data against a set of rules.
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid
 * @property {string[]} errors
 * @property {string[]} warnings
 */

/**
 * Validate a parsed env object.
 * @param {Record<string, string>} env - Parsed env key/value pairs.
 * @param {Object} [options]
 * @param {string[]} [options.required] - Keys that must be present and non-empty.
 * @param {string[]} [options.nonempty] - Keys that must not be empty if present.
 * @param {Record<string, RegExp>} [options.patterns] - Keys mapped to regex patterns.
 * @returns {ValidationResult}
 */
function validate(env, options = {}) {
  const errors = [];
  const warnings = [];

  const { required = [], nonempty = [], patterns = {} } = options;

  for (const key of required) {
    if (!(key in env)) {
      errors.push(`Missing required key: ${key}`);
    } else if (env[key].trim() === '') {
      errors.push(`Required key is empty: ${key}`);
    }
  }

  for (const key of nonempty) {
    if (key in env && env[key].trim() === '') {
      warnings.push(`Key is present but empty: ${key}`);
    }
  }

  for (const [key, pattern] of Object.entries(patterns)) {
    if (key in env) {
      if (!pattern.test(env[key])) {
        errors.push(`Key "${key}" does not match expected pattern ${pattern}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

module.exports = { validate };
