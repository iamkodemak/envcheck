const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { flatten, unflatten } = require('./flatten');
const { formatFlatten } = require('./formatter.flatten');

/**
 * Read and parse an env file.
 * @param {string} filePath
 * @returns {Record<string, string>}
 */
function readEnvFile(filePath) {
  const content = fs.readFileSync(path.resolve(filePath), 'utf8');
  return parse(content);
}

/**
 * Serialize a flat record back to .env format.
 * @param {Record<string, string>} env
 * @returns {string}
 */
function serializeEnv(env) {
  return Object.entries(env)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n') + '\n';
}

/**
 * Run the flatten/unflatten command.
 * @param {string} filePath
 * @param {object} opts
 * @param {boolean} opts.unflattenMode
 * @param {string|null} opts.output
 * @param {boolean} opts.json
 */
function runFlatten(filePath, opts = {}) {
  const { unflattenMode = false, output = null, json = false } = opts;

  const env = readEnvFile(filePath);
  let result;

  if (unflattenMode) {
    result = unflatten(env);
  } else {
    result = flatten(env);
  }

  if (output) {
    const serialized = unflattenMode
      ? JSON.stringify(result, null, 2) + '\n'
      : serializeEnv(result);
    fs.writeFileSync(path.resolve(output), serialized, 'utf8');
    console.log(`Written to ${output}`);
    return;
  }

  if (json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const mode = unflattenMode ? 'unflatten' : 'flatten';
  console.log(formatFlatten(result, mode));
}

module.exports = { readEnvFile, serializeEnv, runFlatten };
