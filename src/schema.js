/**
 * Schema validation: check that all required keys are present and match expected types/patterns.
 */

/**
 * @param {Record<string, string>} env - parsed env object
 * @param {Record<string, {required?: boolean, pattern?: RegExp, type?: 'string'|'number'|'boolean'}>} schema
 * @returns {{ key: string, message: string }[]}
 */
function validateSchema(env, schema) {
  const errors = [];

  for (const [key, rules] of Object.entries(schema)) {
    const value = env[key];

    if (rules.required && (value === undefined || value === '')) {
      errors.push({ key, message: `required key "${key}" is missing or empty` });
      continue;
    }

    if (value === undefined) continue;

    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push({ key, message: `value for "${key}" does not match expected pattern` });
    }

    if (rules.type === 'number' && isNaN(Number(value))) {
      errors.push({ key, message: `value for "${key}" must be a number` });
    }

    if (rules.type === 'boolean' && value !== 'true' && value !== 'false') {
      errors.push({ key, message: `value for "${key}" must be true or false` });
    }
  }

  return errors;
}

module.exports = { validateSchema };
