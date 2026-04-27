/**
 * cli.prefix.js — CLI handler for the prefix command
 */
const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { addPrefix, removePrefix } = require('./prefix');

function readEnvFile(filePath) {
  const content = fs.readFileSync(path.resolve(filePath), 'utf8');
  return parse(content);
}

function serializeEnv(env) {
  return Object.entries(env)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n') + '\n';
}

/**
 * @param {object} argv
 * @param {string} argv.file
 * @param {string} argv.prefix
 * @param {'add'|'remove'} argv.action
 * @param {boolean} [argv.strict]
 * @param {string} [argv.output]
 */
function runPrefix(argv) {
  const { file, prefix, action, strict = false, output } = argv;

  if (!prefix) {
    console.error('Error: --prefix is required');
    process.exit(1);
  }

  let env;
  try {
    env = readEnvFile(file);
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(1);
  }

  const result =
    action === 'remove'
      ? removePrefix(env, prefix, { strict })
      : addPrefix(env, prefix);

  const serialized = serializeEnv(result);

  if (output) {
    fs.writeFileSync(path.resolve(output), serialized, 'utf8');
    console.log(`Written to ${output}`);
  } else {
    process.stdout.write(serialized);
  }
}

module.exports = { readEnvFile, serializeEnv, runPrefix };
