'use strict';

const { colorize } = require('./formatter');

/**
 * Formats the result of validateRequired for CLI output.
 * @param {{ missing: string[], empty: string[], valid: boolean }} result
 * @param {{ color?: boolean }} options
 * @returns {string}
 */
function formatValidateRequired(result, options = {}) {
  const { color = true } = options;
  const lines = [];

  if (result.valid) {
    lines.push(colorize('✔ All required keys are present and non-empty.', 'green', color));
    return lines.join('\n');
  }

  if (result.missing.length > 0) {
    lines.push(colorize('✖ Missing required keys:', 'red', color));
    for (const key of result.missing) {
      lines.push(`  ${colorize(key, 'red', color)}`);
    }
  }

  if (result.empty.length > 0) {
    lines.push(colorize('⚠ Empty required keys:', 'yellow', color));
    for (const key of result.empty) {
      lines.push(`  ${colorize(key, 'yellow', color)}`);
    }
  }

  return lines.join('\n');
}

module.exports = { formatValidateRequired };
