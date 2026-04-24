const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { encrypt, decrypt } = require('./encrypt');
const { formatEncrypt } = require('./formatter.encrypt');

function readEnvFile(filePath) {
  const content = fs.readFileSync(path.resolve(filePath), 'utf8');
  return parse(content);
}

function serializeEnv(parsed) {
  return Object.entries(parsed)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n') + '\n';
}

function runEncrypt(argv) {
  const { file, secret, keys, decrypt: doDecrypt, output, quiet } = argv;

  if (!secret) {
    console.error('Error: --secret is required');
    process.exit(1);
  }

  let parsed;
  try {
    parsed = readEnvFile(file);
  } catch (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(1);
  }

  const keyList = keys ? keys.split(',').map(k => k.trim()) : null;

  let result;
  try {
    result = doDecrypt
      ? decrypt(parsed, secret, keyList)
      : encrypt(parsed, secret, keyList);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const mode = doDecrypt ? 'decrypt' : 'encrypt';

  if (output) {
    fs.writeFileSync(path.resolve(output), serializeEnv(result));
    if (!quiet) console.log(`Written to ${output}`);
  } else {
    if (!quiet) console.log(formatEncrypt(result, mode));
    else console.log(serializeEnv(result));
  }
}

module.exports = { readEnvFile, serializeEnv, runEncrypt };
