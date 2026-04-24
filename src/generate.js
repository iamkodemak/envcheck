/**
 * generate.js
 * Generate .env files from a template with placeholder values.
 * Supports typed placeholders: string, number, boolean, uuid, url, email.
 */

const { randomUUID } = require('crypto');

/**
 * Built-in generators for common placeholder types.
 */
const TYPE_GENERATORS = {
  string:  () => '',
  str:     () => '',
  number:  () => '0',
  num:     () => '0',
  int:     () => '0',
  float:   () => '0.0',
  boolean: () => 'false',
  bool:    () => 'false',
  uuid:    () => randomUUID(),
  url:     () => 'https://example.com',
  email:   () => 'user@example.com',
  secret:  () => randomUUID().replace(/-/g, ''),
  port:    () => '3000',
};

/**
 * Parse a template line like:
 *   KEY=<type>           → { key, type, comment: '' }
 *   KEY=<type:comment>   → { key, type, comment }
 *   KEY=literal          → passthrough (not a placeholder)
 *
 * @param {string} line
 * @returns {{ key: string, type: string|null, comment: string, raw: string }|null}
 */
function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;

  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) return null;

  const key = trimmed.slice(0, eqIdx).trim();
  const valuePart = trimmed.slice(eqIdx + 1).trim();

  // Placeholder syntax: <type> or <type:description>
  const placeholderMatch = valuePart.match(/^<([^>:]+)(?::([^>]*))?\s*>$/);
  if (placeholderMatch) {
    return {
      key,
      type: placeholderMatch[1].trim().toLowerCase(),
      comment: placeholderMatch[2] ? placeholderMatch[2].trim() : '',
      raw: null,
    };
  }

  // Not a placeholder — pass the value through as-is
  return { key, type: null, comment: '', raw: valuePart };
}

/**
 * Generate an env object from a template string.
 *
 * @param {string} templateContent - Contents of a .env.template file
 * @param {Object} [overrides={}]  - Optional map of key → value to override generated values
 * @returns {{ key: string, value: string, generated: boolean, comment: string }[]}
 */
function generate(templateContent, overrides = {}) {
  const lines = templateContent.split(/\r?\n/);
  const results = [];

  for (const line of lines) {
    const parsed = parseLine(line);
    if (!parsed) continue;

    const { key, type, comment, raw } = parsed;

    if (key in overrides) {
      results.push({ key, value: String(overrides[key]), generated: false, comment });
      continue;
    }

    if (type === null) {
      // Literal value from template
      results.push({ key, value: raw, generated: false, comment });
    } else {
      const generator = TYPE_GENERATORS[type];
      if (!generator) {
        throw new Error(`Unknown placeholder type "${type}" for key "${key}"`);
      }
      results.push({ key, value: generator(), generated: true, comment });
    }
  }

  return results;
}

/**
 * Serialize generated entries back to .env format.
 *
 * @param {{ key: string, value: string, generated: boolean, comment: string }[]} entries
 * @returns {string}
 */
function serializeGenerated(entries) {
  return entries
    .map(({ key, value, comment }) => {
      const line = `${key}=${value}`;
      return comment ? `# ${comment}\n${line}` : line;
    })
    .join('\n') + '\n';
}

module.exports = { generate, serializeGenerated, parseLine, TYPE_GENERATORS };
