const { colorize } = require('./formatter');

/**
 * Format the result of applyDefaults for CLI output.
 * @param {object} param0
 * @param {string[]} param0.added
 * @param {string[]} param0.skipped
 * @param {boolean} [param0.quiet=false]
 * @returns {string}
 */
function formatDefaults({ added, skipped, quiet = false }) {
  const lines = [];

  if (added.length === 0 && !quiet) {
    lines.push(colorize('gray', 'No missing keys found. Target is already complete.'));
    return lines.join('\n');
  }

  for (const key of added) {
    lines.push(colorize('green', `+ ${key}`));
  }

  if (!quiet && skipped.length > 0) {
    lines.push('');
    lines.push(colorize('gray', `Skipped (already present): ${skipped.join(', ')}`));
  }

  lines.push('');
  lines.push(
    colorize('cyan', `Applied ${added.length} default(s), skipped ${skipped.length}.`)
  );

  return lines.join('\n');
}

module.exports = { formatDefaults };
