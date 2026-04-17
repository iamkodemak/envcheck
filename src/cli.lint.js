const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { lint } = require('./lint');
const { formatLint } = require('./formatter.lint');

/**
 * Read a file and return its raw content.
 * @param {string} filePath
 * @returns {string}
 */
function readEnvFile(filePath) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }
  return fs.readFileSync(resolved, 'utf8');
}

/**
 * Run lint on one or more env files.
 * @param {string[]} filePaths
 * @param {{ strict?: boolean }} opts - strict mode treats warnings as errors
 * @returns {{ exitCode: number, output: string }}
 */
function runLint(filePaths, opts = {}) {
  const outputs = [];
  let hasError = false;

  for (const filePath of filePaths) {
    let raw;
    try {
      raw = readEnvFile(filePath);
    } catch (e) {
      outputs.push(`Error: ${e.message}\n`);
      hasError = true;
      continue;
    }

    const parsed = parse(raw);
    const issues = lint(parsed, raw);
    outputs.push(formatLint(filePath, issues));

    if (issues.some(i => i.level === 'error')) hasError = true;
    if (opts.strict && issues.some(i => i.level === 'warn')) hasError = true;
  }

  return {
    output: outputs.join('\n'),
    exitCode: hasError ? 1 : 0,
  };
}

module.exports = { readEnvFile, runLint };
