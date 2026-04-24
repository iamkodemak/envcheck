const fs = require('fs');
const { parse } = require('./parser');
const { group } = require('./group');
const { formatGroup } = require('./formatter.group');

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return parse(content);
}

/**
 * CLI handler for the `group` command.
 * @param {string} filePath
 * @param {object} opts
 * @param {string} [opts.delimiter]
 * @param {boolean} [opts.json]
 * @param {boolean} [opts.noColor]
 */
function runGroup(filePath, opts = {}) {
  const delimiter = opts.delimiter || '_';
  const useColor = !opts.noColor;

  let env;
  try {
    env = readEnvFile(filePath);
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
    return;
  }

  const grouped = group(env, delimiter);

  if (opts.json) {
    console.log(JSON.stringify(grouped, null, 2));
    return;
  }

  const output = formatGroup(grouped, { color: useColor });
  console.log(output);
}

module.exports = { readEnvFile, runGroup };
