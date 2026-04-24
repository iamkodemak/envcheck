/**
 * cli.compare.js — CLI handler for the `compare` command
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { compare } = require('./compare');
const { colorize } = require('./formatter');

function readEnvFile(filePath) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return parse(fs.readFileSync(resolved, 'utf8'));
}

function formatCompare(result, opts = {}) {
  const lines = [];
  const { missing, extra, changed, matching } = result;

  if (missing.length) {
    lines.push(colorize('yellow', `Missing keys (in base, not in target): ${missing.length}`));
    missing.forEach((k) => lines.push(colorize('yellow', `  - ${k}`)));
  }

  if (extra.length) {
    lines.push(colorize('cyan', `Extra keys (in target, not in base): ${extra.length}`));
    extra.forEach((k) => lines.push(colorize('cyan', `  + ${k}`)));
  }

  if (changed.length) {
    lines.push(colorize('red', `Changed values: ${changed.length}`));
    changed.forEach(({ key, base, target }) => {
      lines.push(colorize('red', `  ~ ${key}`));
      if (opts.showValues) {
        lines.push(`      base:   ${base}`);
        lines.push(`      target: ${target}`);
      }
    });
  }

  if (opts.showMatching && matching.length) {
    lines.push(colorize('green', `Matching keys: ${matching.length}`));
    matching.forEach((k) => lines.push(colorize('green', `  = ${k}`)));
  }

  if (!missing.length && !extra.length && !changed.length) {
    lines.push(colorize('green', 'Files are identical.'));
  }

  return lines.join('\n');
}

function runCompare(argv, opts = {}) {
  const [baseFile, targetFile] = argv;
  if (!baseFile || !targetFile) {
    throw new Error('Usage: envcheck compare <base> <target> [--show-values] [--show-matching]');
  }

  const base = readEnvFile(baseFile);
  const target = readEnvFile(targetFile);
  const result = compare(base, target);
  const output = formatCompare(result, opts);

  process.stdout.write(output + '\n');

  const hasIssues = result.missing.length || result.extra.length || result.changed.length;
  return hasIssues ? 1 : 0;
}

module.exports = { readEnvFile, formatCompare, runCompare };
