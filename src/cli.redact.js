const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { redact } = require('./redact');

function readEnvFile(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) throw new Error(`File not found: ${filePath}`);
  return fs.readFileSync(abs, 'utf8');
}

function serializeEnv(env) {
  return Object.entries(env)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n') + '\n';
}

/**
 * Redact sensitive keys from an env file.
 * If --output is provided, write to that file; otherwise print to stdout.
 */
function runRedact(argv) {
  const inputPath = argv._[1];
  if (!inputPath) {
    console.error('Usage: envcheck redact <file> [--output <file>] [--placeholder <str>]');
    process.exit(1);
  }

  let raw;
  try {
    raw = readEnvFile(inputPath);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const env = parse(raw);
  const placeholder = argv.placeholder ?? '***';
  const redacted = redact(env, { placeholder });
  const output = serializeEnv(redacted);

  if (argv.output) {
    const outPath = path.resolve(argv.output);
    fs.writeFileSync(outPath, output, 'utf8');
    console.log(`Redacted env written to ${argv.output}`);
  } else {
    process.stdout.write(output);
  }
}

module.exports = { readEnvFile, serializeEnv, runRedact };
