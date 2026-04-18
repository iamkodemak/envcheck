/**
 * Redact sensitive values in a parsed env object.
 * Keys matching patterns are replaced with a placeholder.
 */

const DEFAULT_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /api[_-]?key/i,
  /private[_-]?key/i,
  /auth/i,
  /credential/i,
];

const DEFAULT_PLACEHOLDER = '***';

/**
 * @param {Record<string, string>} env - parsed env object
 * @param {object} options
 * @param {RegExp[]} [options.patterns] - patterns to match sensitive keys
 * @param {string} [options.placeholder] - replacement value
 * @returns {Record<string, string>} redacted env object
 */
function redact(env, options = {}) {
  const patterns = options.patterns ?? DEFAULT_PATTERNS;
  const placeholder = options.placeholder ?? DEFAULT_PLACEHOLDER;

  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => {
      const sensitive = patterns.some((pattern) => pattern.test(key));
      return [key, sensitive ? placeholder : value];
    })
  );
}

module.exports = { redact, DEFAULT_PATTERNS, DEFAULT_PLACEHOLDER };
