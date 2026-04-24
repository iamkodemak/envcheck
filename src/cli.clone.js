/**
 * cli.clone.js — CLI handler for the `clone` command
 */
const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { clone } = require('./clone');

function readEnvFile(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) throw new Error(`File not found: ${filePath}`);
  return parse(fs.readFileSync(abs, 'utf8'));
}

function serializeEnv(parsed) {
  return Object.entries(parsed)
    .map(([key, { value, comment }]) => {
      const line = `${key}=${value}`;
      return comment ? `${comment}\n${line}` : line;
    })
    .join('\n') + '\n';
}

/**
 * @param {string} src        - Source .env file path
 * @param {string} dest       - Destination file path to write
 * @param {Object} opts
 * @param {string} [opts.only]      - Comma-separated list of keys to include
 * @param {string} [opts.exclude]   - Comma-separated list of keys to exclude
 * @param {string} [opts.override]  - Comma-separated KEY=VALUE pairs
 * @param {boolean} [opts.dryRun]   - Print output instead of writing
 */
function runClone(src, dest, opts = {}, out = process.stdout, err = process.stderr) {
  let source;
  try {
    source = readEnvFile(src);
  } catch (e) {
    err.write(`error: ${e.message}\n`);
    return 1;
  }

  const only    = opts.only    ? opts.only.split(',').map(k => k.trim()).filter(Boolean)    : null;
  const exclude = opts.exclude ? opts.exclude.split(',').map(k => k.trim()).filter(Boolean) : [];

  const overrides = {};
  if (opts.override) {
    for (const pair of opts.override.split(',')) {
      const idx = pair.indexOf('=');
      if (idx === -1) continue;
      overrides[pair.slice(0, idx).trim()] = pair.slice(idx + 1).trim();
    }
  }

  const { result, skipped, overridden } = clone(source, { only, exclude, overrides });
  const serialized = serializeEnv(result);

  if (opts.dryRun) {
    out.write(serialized);
  } else {
    fs.writeFileSync(path.resolve(dest), serialized, 'utf8');
    out.write(`Cloned ${src} → ${dest}\n`);
    if (skipped.length)   out.write(`  Skipped:    ${skipped.join(', ')}\n`);
    if (overridden.length) out.write(`  Overridden: ${overridden.join(', ')}\n`);
  }
  return 0;
}

module.exports = { readEnvFile, serializeEnv, runClone };
