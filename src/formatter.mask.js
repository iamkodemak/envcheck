'use strict';

const { colorize } = require('./formatter');

/**
 * Format the result of a mask operation for CLI output.
 *
 * @param {Record<string, string>} original  original env map
 * @param {Record<string, string>} masked    masked env map
 * @param {string[]}               keys      keys that were masked
 * @returns {string}
 */
function formatMask(original, masked, keys) {
  if (keys.length === 0) {
    return colorize('yellow', '⚠ No keys specified for masking.');
  }

  const lines = [];
  const maskedSet = new Set(keys);

  for (const [k, v] of Object.entries(masked)) {
    if (maskedSet.has(k)) {
      const orig = original[k] ?? '';
      lines.push(
        `${colorize('cyan', k)}: ${colorize('red', orig)} → ${colorize('green', v)}`
      );
    }
  }

  const notFound = keys.filter((k) => !(k in original));
  if (notFound.length > 0) {
    lines.push('');
    lines.push(colorize('yellow', `⚠ Keys not found in env: ${notFound.join(', ')}`));
  }

  if (lines.length === 0) {
    return colorize('yellow', '⚠ None of the specified keys were found.');
  }

  return lines.join('\n');
}

module.exports = { formatMask };
