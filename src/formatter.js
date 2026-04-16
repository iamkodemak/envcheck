/**
 * Formats diff and validation results for output.
 */

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function colorize(text, color, useColor = true) {
  if (!useColor) return text;
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

function formatDiff(diffResult, options = {}) {
  const { useColor = true } = options;
  const lines = [];

  if (diffResult.added.length > 0) {
    lines.push(colorize('Missing in target:', 'bold', useColor));
    diffResult.added.forEach((key) => {
      lines.push(colorize(`  + ${key}`, 'green', useColor));
    });
  }

  if (diffResult.removed.length > 0) {
    lines.push(colorize('Extra in target:', 'bold', useColor));
    diffResult.removed.forEach((key) => {
      lines.push(colorize(`  - ${key}`, 'red', useColor));
    });
  }

  if (diffResult.changed.length > 0) {
    lines.push(colorize('Changed keys:', 'bold', useColor));
    diffResult.changed.forEach((key) => {
      lines.push(colorize(`  ~ ${key}`, 'yellow', useColor));
    });
  }

  if (lines.length === 0) {
    lines.push(colorize('No differences found.', 'cyan', useColor));
  }

  return lines.join('\n');
}

function formatValidation(validationResult, options = {}) {
  const { useColor = true } = options;
  const lines = [];

  if (validationResult.errors.length > 0) {
    lines.push(colorize('Validation Errors:', 'bold', useColor));
    validationResult.errors.forEach((err) => {
      lines.push(colorize(`  ✖ ${err}`, 'red', useColor));
    });
  }

  if (validationResult.warnings.length > 0) {
    lines.push(colorize('Warnings:', 'bold', useColor));
    validationResult.warnings.forEach((warn) => {
      lines.push(colorize(`  ⚠ ${warn}`, 'yellow', useColor));
    });
  }

  if (lines.length === 0) {
    lines.push(colorize('All validations passed.', 'green', useColor));
  }

  return lines.join('\n');
}

module.exports = { formatDiff, formatValidation, colorize };
