const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { transform } = require('./transform');
const { formatTransform } = require('./formatter.transform');

function readEnvFile(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) throw new Error(`File not found: ${filePath}`);
  return parse(fs.readFileSync(abs, 'utf8'));
}

/**
 * Run transform command.
 * @param {string} filePath
 * @param {string[]} ops  e.g. ['KEY:trim', '*:uppercase']
 * @param {{ write: boolean, output?: string }} options
 */
function runTransform(filePath, ops, options = {}) {
  let env;
  try {
    env = readEnvFile(filePath);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const parsed = ops.map((op) => {
    const idx = op.lastIndexOf(':');
    if (idx === -1) {
      console.error(`Invalid operation format (expected key:transform): "${op}"`);
      process.exit(1);
    }
    return { key: op.slice(0, idx), transform: op.slice(idx + 1) };
  });

  const { result, warnings } = transform(env, parsed);
  console.log(formatTransform(env, result, warnings));

  if (options.write || options.output) {
    const dest = path.resolve(options.output || filePath);
    const content = Object.entries(result)
      .map(([k, v]) => `${k}=${v}`)
      .join('\n') + '\n';
    fs.writeFileSync(dest, content, 'utf8');
    console.log(`\nWritten to ${dest}`);
  }
}

module.exports = { readEnvFile, runTransform };
