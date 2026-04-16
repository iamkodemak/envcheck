/**
 * Formats a diff result into a human-readable CLI report.
 * @param {Object} diffResult - Output from diff()
 * @param {Object} options
 * @param {boolean} options.color - Whether to use ANSI color codes
 * @returns {string} formatted report
 */
function report(diffResult, options = {}) {
  const { missing, extra, changed, matching } = diffResult;
  const useColor = options.color !== false;

  const red = s => useColor ? `\x1b[31m${s}\x1b[0m` : s;
  const green = s => useColor ? `\x1b[32m${s}\x1b[0m` : s;
  const yellow = s => useColor ? `\x1b[33m${s}\x1b[0m` : s;
  const bold = s => useColor ? `\x1b[1m${s}\x1b[0m` : s;

  const lines = [];

  if (!diffResult.hasDiff) {
    lines.push(green('✔ No differences found.'));
    lines.push(`  ${matching.length} key(s) match.`);
    return lines.join('\n');
  }

  if (missing.length > 0) {
    lines.push(bold('Missing keys (in base but not in target):'));
    for (const { key, baseValue } of missing) {
      const display = baseValue === '' ? '(empty)' : baseValue;
      lines.push(red(`  - ${key}`) + `  [base: ${display}]`);
    }
  }

  if (extra.length > 0) {
    lines.push(bold('Extra keys (in target but not in base):'));
    for (const { key, targetValue } of extra) {
      const display = targetValue === '' ? '(empty)' : targetValue;
      lines.push(green(`  + ${key}`) + `  [target: ${display}]`);
    }
  }

  if (changed.length > 0) {
    lines.push(bold('Changed values:'));
    for (const { key, baseValue, targetValue } of changed) {
      lines.push(yellow(`  ~ ${key}`));
      lines.push(`      base:   ${baseValue === '' ? '(empty)' : baseValue}`);
      lines.push(`      target: ${targetValue === '' ? '(empty)' : targetValue}`);
    }
  }

  lines.push('');
  lines.push(`Summary: ${red(missing.length + ' missing')}, ${green(extra.length + ' extra')}, ${yellow(changed.length + ' changed')}, ${matching.length} matching.`);

  return lines.join('\n');
}

module.exports = { report };
