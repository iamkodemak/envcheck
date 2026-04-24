const { colorize } = require('./formatter');

/**
 * Formats a grouped env object for display.
 * @param {Record<string, Record<string, string>>} grouped
 * @param {object} [options]
 * @param {boolean} [options.color=true]
 * @returns {string}
 */
function formatGroup(grouped, { color = true } = {}) {
  const lines = [];

  const c = (type, text) => (color ? colorize(type, text) : text);

  const prefixes = Object.keys(grouped).sort((a, b) =>
    a === '__ungrouped__' ? 1 : b === '__ungrouped__' ? -1 : a.localeCompare(b)
  );

  for (const prefix of prefixes) {
    const label = prefix === '__ungrouped__' ? '(ungrouped)' : prefix;
    lines.push(c('section', `[${label}]`));

    const entries = grouped[prefix];
    for (const [subKey, value] of Object.entries(entries).sort()) {
      const fullKey = prefix === '__ungrouped__' ? subKey : `${prefix}_${subKey}`;
      lines.push(`  ${c('key', fullKey)} = ${c('value', value)}`);
    }

    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

module.exports = { formatGroup };
