const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { promote } = require('./promote');

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
 * runPromote({ source, target, output, keys, prefix, overwrite, dryRun })
 */
function runPromote(argv) {
  const {
    source,
    target,
    output,
    keys,
    prefix,
    overwrite = true,
    dryRun = false,
  } = argv;

  const srcEnv = readEnvFile(source);
  const tgtEnv = readEnvFile(target);

  const keyList = keys
    ? (Array.isArray(keys) ? keys : keys.split(',').map((k) => k.trim()))
    : undefined;

  const { result, promoted, skipped } = promote(srcEnv, tgtEnv, {
    keys: keyList,
    prefix,
    overwrite,
  });

  if (promoted.length === 0) {
    console.log('No keys promoted.');
    return;
  }

  console.log(`Promoted (${promoted.length}): ${promoted.join(', ')}`);
  if (skipped.length > 0) {
    console.log(`Skipped  (${skipped.length}): ${skipped.join(', ')}`);
  }

  if (dryRun) {
    console.log('[dry-run] No files written.');
    return;
  }

  const dest = output || target;
  fs.writeFileSync(path.resolve(dest), serializeEnv(result), 'utf8');
  console.log(`Written to ${dest}`);
}

module.exports = { readEnvFile, serializeEnv, runPromote };
