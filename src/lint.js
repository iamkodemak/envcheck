/**
 * Lint .env files for common issues:
 * - duplicate keys
 * - keys with empty values
 * - keys not in UPPER_SNAKE_CASE
 * - lines that are not comments, blanks, or KEY=VALUE
 */

const KEY_REGEX = /^[A-Z][A-Z0-9_]*$/;

/**
 * @param {Record<string,string>} parsed - parsed env object
 * @param {string} raw - raw file content
 * @returns {{ level: 'error'|'warn', message: string }[]}
 */
function lint(parsed, raw) {
  const issues = [];
  const seenKeys = new Set();

  const lines = raw.split('\n');
  lines.forEach((line, i) => {
    const lineNum = i + 1;
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) return;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) {
      issues.push({ level: 'error', message: `Line ${lineNum}: invalid format (no '=' found): "${trimmed}"` });
      return;
    }

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();

    if (!KEY_REGEX.test(key)) {
      issues.push({ level: 'warn', message: `Line ${lineNum}: key "${key}" is not UPPER_SNAKE_CASE` });
    }

    if (seenKeys.has(key)) {
      issues.push({ level: 'error', message: `Line ${lineNum}: duplicate key "${key}"` });
    }
    seenKeys.add(key);

    if (value === '') {
      issues.push({ level: 'warn', message: `Line ${lineNum}: key "${key}" has an empty value` });
    }
  });

  return issues;
}

module.exports = { lint };
