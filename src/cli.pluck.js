const fs = require('fs');
const { parse } = require('./parser');
const { pluck } = require('./pluck');
const { formatPluck } = require('./formatter.pluck');

function readEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return parse(content);
}

/**
 * runPluck — CLI handler for the `pluck` command.
 * Extracts specified keys from an env file and prints them.
 *
 * @param {object} argv - parsed CLI arguments
 * @param {string} argv.file - path to .env file
 * @param {string[]} argv.keys - keys to pluck
 * @param {boolean} [argv.strict] - fail if any key is missing
 * @param {boolean} [argv.noColor] - disable color output
 * @param {object} [io] - injectable I/O (for testing)
 */
function runPluck(argv, io = {}) {
  const { file, keys, strict = false, noColor = false } = argv;
  const out = io.stdout || process.stdout;
  const err = io.stderr || process.stderr;
  const exit = io.exit || process.exit;

  if (!file) {
    err.write('Error: --file is required\n');
    return exit(1);
  }

  if (!keys || keys.length === 0) {
    err.write('Error: at least one key must be specified\n');
    return exit(1);
  }

  let env;
  try {
    env = readEnvFile(file);
  } catch (e) {
    err.write(`Error reading file: ${e.message}\n`);
    return exit(1);
  }

  let result, missing;
  try {
    ({ result, missing } = pluck(env, keys, { strict }));
  } catch (e) {
    err.write(`Error: ${e.message}\n`);
    return exit(1);
  }

  const output = formatPluck(result, missing, { color: !noColor });
  if (output) out.write(output + '\n');

  if (missing.length > 0 && !strict) {
    return exit(1);
  }

  exit(0);
}

module.exports = { readEnvFile, runPluck };
