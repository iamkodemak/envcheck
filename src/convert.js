/**
 * Convert .env file to other formats (json, yaml, export)
 */

/**
 * @param {Record<string, string>} parsed - key/value pairs from parser
 * @param {'json'|'yaml'|'export'} format
 * @returns {string}
 */
function convert(parsed, format) {
  switch (format) {
    case 'json':
      return convertToJson(parsed);
    case 'yaml':
      return convertToYaml(parsed);
    case 'export':
      return convertToExport(parsed);
    default:
      throw new Error(`Unsupported format: "${format}". Use json, yaml, or export.`);
  }
}

function convertToJson(parsed) {
  return JSON.stringify(parsed, null, 2);
}

function convertToYaml(parsed) {
  return Object.entries(parsed)
    .map(([key, value]) => {
      const needsQuotes = /[:#{}[\],&*?|<>=!%@`]/.test(value) || value === '' || /^(true|false|null|~)$/i.test(value);
      const formatted = needsQuotes ? `"${value.replace(/"/g, '\\"')}"` : value;
      return `${key}: ${formatted}`;
    })
    .join('\n');
}

function convertToExport(parsed) {
  return Object.entries(parsed)
    .map(([key, value]) => {
      const escaped = value.replace(/'/g, "'\\''" );
      return `export ${key}='${escaped}'`;
    })
    .join('\n');
}

module.exports = { convert };
