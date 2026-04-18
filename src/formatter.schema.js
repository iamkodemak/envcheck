const { colorize } = require('./formatter');

/**
 * Format schema validation errors for CLI output.
 * @param {{ key: string, message: string }[]} errors
 * @param {string} [filePath]
 * @returns {string}
 */
function formatSchema(errors, filePath) {
  if (errors.length === 0) {
    const label = filePath ? ` ${filePath}` : '';
    return colorize(`✔ schema valid${label}`, 'green');
  }

  const lines = [];
  const label = filePath ? ` in ${filePath}` : '';
  lines.push(colorize(`✖ schema errors${label}:`, 'red'));

  for (const { key, message } of errors) {
    lines.push(`  ${colorize(key, 'yellow')}: ${message}`);
  }

  return lines.join('\n');
}

module.exports = { formatSchema };
