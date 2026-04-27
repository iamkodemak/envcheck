const { colorize } = require('./formatter');

/**
 * Format sanitize changes for CLI output.
 * @param {Array<{key: string, before: string, after: string}>} changes
 * @param {object} [opts]
 * @param {boolean} [opts.noColor]
 * @returns {string}
 */
function formatSanitize(changes, opts = {}) {
  if (changes.length === 0) {
    return colorize('green', '✔ No sanitization changes.', opts.noColor);
  }

  const lines = [
    colorize('yellow', `⚠ ${changes.length} value(s) sanitized:`, opts.noColor),
    ''
  ];

  for (const { key, before, after } of changes) {
    lines.push(`  ${colorize('cyan', key, opts.noColor)}`);
    lines.push(`    before: ${colorize('red',   JSON.stringify(before), opts.noColor)}`);
    lines.push(`    after:  ${colorize('green', JSON.stringify(after),  opts.noColor)}`);
  }

  return lines.join('\n');
}

module.exports = { formatSanitize };
