/**
 * CLI handler for the convert command
 */
const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { convert } = require('./convert');
const { formatConvert } = require('./formatter.convert');

function readEnvFile(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(abs, 'utf8');
}

/**
 * @param {string} filePath
 * @param {'json'|'yaml'|'export'} format
 * @param {{ output?: string, noHeader?: boolean }} options
 */
function runConvert(filePath, format, options = {}) {
  const SUPPORTED = ['json', 'yaml', 'export'];
  if (!SUPPORTED.includes(format)) {
    console.error(`Error: unsupported format "${format}". Choose from: ${SUPPORTED.join(', ')}.`);
    process.exit(1);
  }

  let raw;
  try {
    raw = readEnvFile(filePath);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const parsed = parse(raw);
  let converted;
  try {
    converted = convert(parsed, format);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  if (options.output) {
    const outPath = path.resolve(options.output);
    fs.writeFileSync(outPath, converted + '\n', 'utf8');
    console.log(`Written to ${options.output}`);
  } else {
    const display = options.noHeader
      ? converted
      : formatConvert(converted, format, filePath);
    console.log(display);
  }
}

module.exports = { readEnvFile, runConvert };
