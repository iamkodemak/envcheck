const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { interpolate } = require('./interpolate');

function readEnvFile(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) throw new Error(`File not found: ${filePath}`);
  return fs.readFileSync(abs, 'utf8');
}

function serializeEnv(env) {
  return Object.entries(env)
    .map(([k, v]) => {
      const needsQuotes = /\s|#/.test(v);
      return needsQuotes ? `${k}="${v}"` : `${k}=${v}`;
    })
    .join('\n');
}

/**
 * Run interpolation on a .env file.
 * @param {string} filePath
 * @param {{ write: boolean, quiet: boolean }} opts
 * @param {object} io - { stdout, stderr }
 */
function runInterpolate(filePath, opts = {}, io = { stdout: process.stdout, stderr: process.stderr }) {
  let raw;
  try {
    raw = readEnvFile(filePath);
  } catch (err) {
    io.stderr.write(`Error: ${err.message}\n`);
    return 1;
  }

  const env = parse(raw);
  const { result, errors } = interpolate(env);

  if (errors.length > 0 && !opts.quiet) {
    io.stderr.write(`Interpolation warnings:\n`);
    errors.forEach(e => io.stderr.write(`  ${e}\n`));
  }

  const output = serializeEnv(result);

  if (opts.write) {
    fs.writeFileSync(path.resolve(filePath), output + '\n', 'utf8');
    if (!opts.quiet) io.stdout.write(`Interpolated values written to ${filePath}\n`);
  } else {
    io.stdout.write(output + '\n');
  }

  return errors.length > 0 ? 1 : 0;
}

module.exports = { readEnvFile, serializeEnv, runInterpolate };
