const { colorize } = require('./formatter');

/**
 * Format the result of a transform operation for CLI output.
 * @param {Record<string, string>} original
 * @param {Record<string, string>} result
 * @param {string[]} warnings
 * @returns {string}
 */
function formatTransform(original, result, warnings) {
  const lines = [];

  const keys = Object.keys(result);
  let changed = 0;

  for (const key of keys) {
    if (original[key] !== result[key]) {
      lines.push(`  ${colorize(key, 'cyan')}: ${colorize(original[key], 'red')} → ${colorize(result[key], 'green')}`);
      changed++;
    }
  }

  if (changed === 0) {
    lines.push(colorize('  No values changed.', 'yellow'));
  } else {
    lines.unshift(colorize(`Transformed ${changed} value(s):`, 'bold'));
  }

  if (warnings.length > 0) {
    lines.push('');
    lines.push(colorize('Warnings:', 'yellow'));
    for (const w of warnings) {
      lines.push(`  ${colorize('⚠', 'yellow')} ${w}`);
    }
  }

  return lines.join('\n');
}

module.exports = { formatTransform };
