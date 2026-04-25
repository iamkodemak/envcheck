const { colorize } = require('./formatter');

/**
 * Format filtered env entries for display.
 *
 * @param {Record<string, string>} original  — original env
 * @param {Record<string, string>} filtered  — filtered result
 * @param {object}  opts
 * @param {boolean} [opts.showExcluded]       — also list excluded keys
 * @param {boolean} [opts.color]              — enable ANSI color
 * @returns {string}
 */
function formatFilter(original, filtered, opts = {}) {
  const { showExcluded = false, color = true } = opts;
  const lines = [];

  const includedKeys = Object.keys(filtered);
  const excludedKeys = Object.keys(original).filter((k) => !(k in filtered));

  if (includedKeys.length === 0) {
    lines.push(colorize('  (no matching entries)', 'yellow', color));
  } else {
    for (const key of includedKeys) {
      lines.push(`  ${colorize(key, 'green', color)}=${filtered[key]}`);
    }
  }

  if (showExcluded && excludedKeys.length > 0) {
    lines.push('');
    lines.push(colorize('Excluded:', 'dim', color));
    for (const key of excludedKeys) {
      lines.push(`  ${colorize(key, 'dim', color)}`);
    }
  }

  const summary = `\nMatched ${includedKeys.length} of ${Object.keys(original).length} entries.`;
  lines.push(colorize(summary, 'cyan', color));

  return lines.join('\n');
}

module.exports = { formatFilter };
