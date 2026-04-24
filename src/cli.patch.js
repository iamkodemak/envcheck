/**
 * cli.patch.js — CLI handler for the `patch` command
 *
 * Usage:
 *   envcheck patch <file> --set KEY=VALUE --unset KEY --rename OLD=NEW [--in-place] [--output <file>]
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { patch } = require('./patch');

function readEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return parse(content);
}

function serializeEnv(env) {
  return Object.entries(env)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n') + '\n';
}

function buildOps(argv) {
  const ops = [];

  const sets = [].concat(argv.set || []);
  for (const s of sets) {
    const idx = s.indexOf('=');
    if (idx === -1) throw new Error(`--set requires KEY=VALUE format, got: ${s}`);
    ops.push({ op: 'set', key: s.slice(0, idx), value: s.slice(idx + 1) });
  }

  const unsets = [].concat(argv.unset || []);
  for (const u of unsets) {
    ops.push({ op: 'unset', key: u });
  }

  const renames = [].concat(argv.rename || []);
  for (const r of renames) {
    const idx = r.indexOf('=');
    if (idx === -1) throw new Error(`--rename requires OLD=NEW format, got: ${r}`);
    ops.push({ op: 'rename', key: r.slice(0, idx), newKey: r.slice(idx + 1) });
  }

  return ops;
}

function runPatch(argv) {
  const filePath = argv._[1];
  if (!filePath) {
    console.error('Usage: envcheck patch <file> [--set K=V] [--unset K] [--rename OLD=NEW]');
    process.exit(1);
  }

  const env = readEnvFile(filePath);
  let ops;
  try {
    ops = buildOps(argv);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  const { result, applied, skipped } = patch(env, ops);

  const serialized = serializeEnv(result);

  if (argv['in-place']) {
    fs.writeFileSync(filePath, serialized, 'utf8');
    console.log(`Patched ${filePath} (${applied.length} applied, ${skipped.length} skipped)`);
  } else if (argv.output) {
    fs.writeFileSync(argv.output, serialized, 'utf8');
    console.log(`Written to ${argv.output} (${applied.length} applied, ${skipped.length} skipped)`);
  } else {
    process.stdout.write(serialized);
  }
}

module.exports = { readEnvFile, serializeEnv, buildOps, runPatch };
