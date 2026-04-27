/**
 * sanitize.js — Remove or replace characters in env values
 * Supports stripping control characters, trimming whitespace,
 * and replacing patterns via regex rules.
 */

/**
 * @param {Record<string, string>} env
 * @param {object} options
 * @param {boolean} [options.stripControl]   remove control characters (\x00-\x1f)
 * @param {boolean} [options.trimValues]     trim leading/trailing whitespace
 * @param {Array<{pattern: string|RegExp, replacement: string}>} [options.rules]
 * @returns {{ result: Record<string, string>, changes: Array<{key: string, before: string, after: string}> }}
 */
function sanitize(env, options = {}) {
  const {
    stripControl = false,
    trimValues = false,
    rules = []
  } = options;

  const result = {};
  const changes = [];

  for (const [key, raw] of Object.entries(env)) {
    let value = raw;

    if (trimValues) {
      value = value.trim();
    }

    if (stripControl) {
      // eslint-disable-next-line no-control-regex
      value = value.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');
    }

    for (const rule of rules) {
      const pattern =
        rule.pattern instanceof RegExp
          ? rule.pattern
          : new RegExp(rule.pattern, 'g');
      value = value.replace(pattern, rule.replacement ?? '');
    }

    if (value !== raw) {
      changes.push({ key, before: raw, after: value });
    }

    result[key] = value;
  }

  return { result, changes };
}

module.exports = { sanitize };
