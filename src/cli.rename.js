const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { rename } = require('./rename');

function readEnvFile(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) throw new Error(`File not found: ${abs}`);
  return parse(fs.readFileSync(abs, 'utf8'));
}

function serializeEnv(env) {
  return Object.entries(env).map(([k, v]) => `${k}=${v}`).join('\n') + '\n';
}

/**
 * runRename: rename keys in an env file according to a JSON map file.
 * @param {string} envPath
 * @param {string} mapPath - JSON file: { "OLD_KEY": "NEW_KEY" }
 * @param {{ inPlace?: boolean, output?: string }} opts
 */
function runRename(envPath, mapPath, opts = {}) {
  const env = readEnvFile(envPath);

  let renameMap;
  try {
    renameMap = JSON.parse(fs.readFileSync(path.resolve(mapPath), 'utf8'));
  } catch (e) {
    console.error(`Failed to parse rename map: ${e.message}`);
    process.exit(1);
  }

  const { result, renamed, notFound } = rename(env, renameMap);

  if (renamed.length > 0) {
    console.log('Renamed keys:');
    renamed.forEach(({ from, to }) => console.log(`  ${from} -> ${to}`));
  }

  if (notFound.length > 0) {
    console.warn('Keys not found (skipped):');
    notFound.forEach(k => console.warn(`  ${k}`));
  }

  const serialized = serializeEnv(result);

  if (opts.inPlace) {
    fs.writeFileSync(path.resolve(envPath), serialized);
    console.log(`Written in place: ${envPath}`);
  } else if (opts.output) {
    fs.writeFileSync(path.resolve(opts.output), serialized);
    console.log(`Written to: ${opts.output}`);
  } else {
    process.stdout.write(serialized);
  }
}

module.exports = { readEnvFile, runRename };
