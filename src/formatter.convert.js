/**
 * Formatter for convert output
 */
const { colorize } = require('./formatter');

/**
 * @param {string} output - converted content string
 * @param {'json'|'yaml'|'export'} format
 * @param {string} sourceFile
 * @returns {string}
 */
function formatConvert(output, format, sourceFile) {
  const header = colorize(`# Converted from ${sourceFile} to ${format.toUpperCase()}`, 'cyan');
  return `${header}\n${output}`;
}

module.exports = { formatConvert };
