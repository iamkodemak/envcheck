/**
 * cli.extract.js — CLI handler for the extract command
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { extract } = require('./extract');

function readEnvFile(filePath) {
  const content = fs.readFileSync(path.resolve(filePath), 'utf8');
  return parse(content);
}

function serializeEnv(env) {
  return Object.entries(env)
    .map(([k, v]) => (v === '' ? k : `${k}=${v}`))
    .join('\n') + '\n';
}

/**
 * @param {string} filePath
 * @param {string[]} keys
 * @param {Object} opts
 * @param {boolean} opts.strict
 * @param {string|null} opts.output
 */
function runExtract(filePath, keys, opts = {}) {
  const { strict = false, output = null } = opts;

  if (!filePath) {
    console.error('Error: env file path is required.');
    process.exit(1);
  }

  if (!keys || keys.length === 0) {
    console.error('Error: at least one key must be specified.');
    process.exit(1);
  }

  let env;
  try {
    env = readEnvFile(filePath);
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(1);
  }

  let result;
  try {
    result = extract(env, keys, { strict });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const { extracted, missing } = result;

  if (missing.length > 0) {
    console.warn(`Warning: missing keys: ${missing.join(', ')}`);
  }

  const serialized = serializeEnv(extracted);

  if (output) {
    fs.writeFileSync(path.resolve(output), serialized, 'utf8');
    console.log(`Extracted ${Object.keys(extracted).length} key(s) to ${output}`);
  } else {
    process.stdout.write(serialized);
  }
}

module.exports = { readEnvFile, serializeEnv, runExtract };
