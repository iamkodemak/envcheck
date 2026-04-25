const fs = require('fs');
const { parse } = require('./parser');
const { filter } = require('./filter');
const { formatFilter } = require('./formatter.filter');

function readEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return parse(content);
}

/**
 * envcheck filter <file> [options]
 *
 * Options:
 *   --key <pattern>      Filter by key regex pattern
 *   --value <pattern>    Filter by value regex pattern
 *   --invert             Invert the match (exclude matched entries)
 *   --show-excluded      Show excluded keys in output
 *   --no-color           Disable color output
 */
function runFilter(args, options = {}) {
  const {
    key,
    value,
    invert = false,
    showExcluded = false,
    color = true,
  } = options;

  if (!args || args.length === 0) {
    console.error('Usage: envcheck filter <file> [--key <pattern>] [--value <pattern>] [--invert]');
    process.exit(1);
  }

  const filePath = args[0];

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const env = readEnvFile(filePath);

  const filterOptions = {
    keyPattern: key || undefined,
    valuePattern: value || undefined,
    invert,
  };

  const filtered = filter(env, filterOptions);
  const output = formatFilter(env, filtered, { showExcluded, color });

  console.log(output);
  return filtered;
}

module.exports = { readEnvFile, runFilter };
