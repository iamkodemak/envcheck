import { colorize } from './formatter.js';

/**
 * Format split results for CLI display.
 * @param {Object} groups - output of split()
 * @param {Object} options
 * @param {boolean} options.color - enable color output
 * @returns {string}
 */
export function formatSplit(groups, options = {}) {
  const { color = true } = options;
  const lines = [];

  for (const [group, env] of Object.entries(groups)) {
    const count = Object.keys(env).length;
    const header = `[${group}] (${count} key${count !== 1 ? 's' : ''})`;
    lines.push(color ? colorize(header, 'cyan') : header);

    for (const [key, entry] of Object.entries(env)) {
      const val = entry.value !== undefined ? entry.value : entry;
      const line = `  ${key}=${val}`;
      lines.push(color ? colorize(line, 'reset') : line);
    }

    lines.push('');
  }

  return lines.join('\n').trimEnd();
}
