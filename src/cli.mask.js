'use strict';

const fs = require('fs');
const { parse } = require('./parser');
const { mask } = require('./mask');
const { formatMask } = require('./formatter.mask');

/**
 * Read and parse an env file from disk.
 * @param {string} filePath
 * @returns {Record<string, string>}
 */
function readEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return parse(content);
}

/**
 * Serialize an env map back to .env file format.
 * @param {Record<string, string>} env
 * @returns {string}
 */
function serializeEnv(env) {
  return Object.entries(env)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n') + '\n';
}

/**
 * CLI handler for the `mask` command.
 *
 * Usage:
 *   envcheck mask <file> --keys KEY1,KEY2 [--reveal N] [--char C] [--write]
 *
 * @param {object} argv  parsed yargs arguments
 */
function runMask(argv) {
  const { file, keys: rawKeys, reveal = 0, char = '*', write = false } = argv;

  if (!file) {
    console.error('Error: <file> argument is required.');
    process.exit(1);
  }

  const keys = rawKeys
    ? String(rawKeys).split(',').map((k) => k.trim()).filter(Boolean)
    : [];

  let env;
  try {
    env = readEnvFile(file);
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(1);
  }

  const masked = mask(env, keys, { reveal: Number(reveal), char });

  if (write) {
    fs.writeFileSync(file, serializeEnv(masked), 'utf8');
    console.log(`Masked ${keys.length} key(s) and wrote to ${file}`);
  } else {
    console.log(formatMask(env, masked, keys));
  }
}

module.exports = { readEnvFile, serializeEnv, runMask };
