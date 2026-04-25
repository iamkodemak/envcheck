const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { applyDefaults } = require('./defaults');
const { formatDefaults } = require('./formatter.defaults');

function readEnvFile(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) throw new Error(`File not found: ${filePath}`);
  return parse(fs.readFileSync(abs, 'utf8'));
}

function serializeEnv(env) {
  return Object.entries(env)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n') + '\n';
}

/**
 * runDefaults - fill missing keys in target using source as defaults.
 * @param {object} argv
 * @param {string} argv.source  - path to defaults/.env.example file
 * @param {string} argv.target  - path to target .env file
 * @param {boolean} [argv.overwrite] - overwrite existing keys
 * @param {boolean} [argv.write]     - write result back to target file
 * @param {boolean} [argv.quiet]     - suppress extra output
 */
function runDefaults(argv) {
  const sourceEnv = readEnvFile(argv.source);
  const targetEnv = readEnvFile(argv.target);

  const { result, added, skipped } = applyDefaults(sourceEnv, targetEnv, {
    overwrite: argv.overwrite || false,
  });

  const formatted = formatDefaults({ added, skipped, quiet: argv.quiet || false });
  console.log(formatted);

  if (argv.write) {
    const abs = path.resolve(argv.target);
    fs.writeFileSync(abs, serializeEnv(result), 'utf8');
    if (!argv.quiet) {
      console.log(`Written to ${argv.target}`);
    }
  }

  return { result, added, skipped };
}

module.exports = { readEnvFile, serializeEnv, runDefaults };
