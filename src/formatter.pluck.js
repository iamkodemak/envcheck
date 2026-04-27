const { colorize } = require('./formatter');

/**
 * Format the result of a pluck operation for CLI output.
 * @param {Record<string, string>} result - plucked key/value pairs
 * @param {string[]} missing - keys that were not found
 * @param {object} [options]
 * @param {boolean} [options.color] - enable color output
 * @param {boolean} [options.showMissing] - show missing keys summary
 * @returns {string}
 */
function formatPluck(result, missing, options = {}) {
  const { color = true, showMissing = true } = options;
  const lines = [];

  for (const [key, value] of Object.entries(result)) {
    const line = `${key}=${value}`;
    lines.push(color ? colorize(line, 'green') : line);
  }

  if (showMissing && missing.length > 0) {
    lines.push('');
    const label = color ? colorize('Missing keys:', 'red') : 'Missing keys:';
    lines.push(label);
    for (const key of missing) {
      lines.push(color ? colorize(`  - ${key}`, 'red') : `  - ${key}`);
    }
  }

  return lines.join('\n');
}

module.exports = { formatPluck };
