'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { validateRequired } = require('./validate-required');
const { formatValidateRequired } = require('./formatter.validate-required');

function readEnvFile(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) throw new Error(`File not found: ${filePath}`);
  return parse(fs.readFileSync(abs, 'utf8'));
}

function readKeysArg(keysArg) {
  if (!keysArg) return [];
  // Support comma-separated or space-separated list
  return keysArg
    .split(/[,\s]+/)
    .map((k) => k.trim())
    .filter(Boolean);
}

/**
 * CLI handler for `envcheck validate-required`
 * @param {object} argv - parsed CLI args
 * @param {string} argv.file - path to .env file
 * @param {string} argv.keys - comma-separated required keys
 * @param {boolean} [argv.color] - enable color output
 */
function runValidateRequired(argv) {
  const { file, keys, color = true } = argv;

  if (!file) {
    console.error('Error: --file is required');
    process.exit(1);
  }

  if (!keys) {
    console.error('Error: --keys is required');
    process.exit(1);
  }

  let env;
  try {
    env = readEnvFile(file);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const requiredKeys = readKeysArg(keys);
  const result = validateRequired(env, requiredKeys);
  const output = formatValidateRequired(result, { color });

  console.log(output);

  if (!result.valid) {
    process.exit(1);
  }
}

module.exports = { readEnvFile, runValidateRequired };
