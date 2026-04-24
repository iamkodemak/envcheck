const { colorize } = require('./formatter');

/**
 * Format the result of a flatten or unflatten operation for CLI output.
 * @param {Record<string, string>} result
 * @param {'flatten'|'unflatten'} mode
 * @returns {string}
 */
function formatFlatten(result, mode = 'flatten') {
  const lines = [];
  const label = mode === 'unflatten' ? 'Unflattened' : 'Flattened';

  lines.push(colorize(`# ${label} output`, 'cyan'));

  if (Object.keys(result).length === 0) {
    lines.push(colorize('(no keys)', 'yellow'));
    return lines.join('\n');
  }

  if (mode === 'unflatten') {
    lines.push(JSON.stringify(result, null, 2));
  } else {
    for (const [key, value] of Object.entries(result)) {
      lines.push(`${colorize(key, 'green')}=${value}`);
    }
  }

  return lines.join('\n');
}

module.exports = { formatFlatten };
