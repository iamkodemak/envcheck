const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { resolve } = require('./resolve');

function readEnvFile(filePath) {
  const content = fs.readFileSync(path.resolve(filePath), 'utf8');
  return parse(content);
}

function serializeEnv(env) {
  return Object.entries(env)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n') + '\n';
}

function runResolve(args, options = {}) {
  const { source, target, output, overwrite = false, dryRun = false, quiet = false } = options;

  if (!source || !target) {
    process.stderr.write('Error: --source and --target are required\n');
    process.exit(1);
  }

  let sourceEnv, targetEnv;
  try {
    sourceEnv = readEnvFile(source);
  } catch (e) {
    process.stderr.write(`Error reading source file: ${e.message}\n`);
    process.exit(1);
  }

  try {
    targetEnv = readEnvFile(target);
  } catch (e) {
    process.stderr.write(`Error reading target file: ${e.message}\n`);
    process.exit(1);
  }

  const { resolved, added, skipped } = resolve(sourceEnv, targetEnv, { overwrite });

  if (!quiet) {
    if (added.length === 0) {
      process.stdout.write('No missing keys to resolve.\n');
    } else {
      process.stdout.write(`Resolved ${added.length} key(s): ${added.join(', ')}\n`);
    }
    if (skipped.length > 0) {
      process.stdout.write(`Skipped ${skipped.length} key(s): ${skipped.join(', ')}\n`);
    }
  }

  if (!dryRun) {
    const dest = output || target;
    fs.writeFileSync(path.resolve(dest), serializeEnv(resolved), 'utf8');
    if (!quiet) {
      process.stdout.write(`Written to ${dest}\n`);
    }
  }

  return { resolved, added, skipped };
}

module.exports = { readEnvFile, serializeEnv, runResolve };
