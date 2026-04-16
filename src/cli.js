#!/usr/bin/env node

/**
 * CLI entry point for envcheck.
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { diff } = require('./diff');
const { validate } = require('./validator');
const { formatDiff, formatValidation } = require('./formatter');

const args = process.argv.slice(2);
const useColor = !args.includes('--no-color');

function readEnvFile(filePath) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(`File not found: ${resolved}`);
    process.exit(1);
  }
  return fs.readFileSync(resolved, 'utf-8');
}

function runDiff() {
  const [, sourceFile, targetFile] = args;
  if (!sourceFile || !targetFile) {
    console.error('Usage: envcheck diff <source> <target>');
    process.exit(1);
  }
  const source = parse(readEnvFile(sourceFile));
  const target = parse(readEnvFile(targetFile));
  const result = diff(source, target);
  console.log(formatDiff(result, { useColor }));
  if (result.added.length > 0 || result.removed.length > 0) process.exit(1);
}

function runValidate() {
  const [, envFile, schemaFile] = args;
  if (!envFile || !schemaFile) {
    console.error('Usage: envcheck validate <envFile> <schemaFile>');
    process.exit(1);
  }
  const env = parse(readEnvFile(envFile));
  const schema = JSON.parse(readEnvFile(schemaFile));
  const result = validate(env, schema);
  console.log(formatValidation(result, { useColor }));
  if (result.errors.length > 0) process.exit(1);
}

const command = args[0];
switch (command) {
  case 'diff':
    runDiff();
    break;
  case 'validate':
    runValidate();
    break;
  default:
    console.error('Unknown command. Available: diff, validate');
    process.exit(1);
}
