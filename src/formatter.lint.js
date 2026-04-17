const { colorize } = require('./formatter');

/**
 * Format lint issues for terminal output.
 * @param {string} filePath
 * @param {{ level: 'error'|'warn', message: string }[]} issues
 * @returns {string}
 */
function formatLint(filePath, issues) {
  if (issues.length === 0) {
    return colorize('green', `✔ No issues found in ${filePath}\n`);
  }

  const lines = [colorize('cyan', `Lint results for ${filePath}:`)];
  let errors = 0;
  let warns = 0;

  issues.forEach(({ level, message }) => {
    if (level === 'error') {
      lines.push(colorize('red', `  ✖ [error] ${message}`));
      errors++;
    } else {
      lines.push(colorize('yellow', `  ⚠ [warn]  ${message}`));
      warns++;
    }
  });

  lines.push('');
  const summary = [];
  if (errors) summary.push(colorize('red', `${errors} error(s)`));
  if (warns) summary.push(colorize('yellow', `${warns} warning(s)`));
  lines.push('Summary: ' + summary.join(', '));

  return lines.join('\n') + '\n';
}

module.exports = { formatLint };
