#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { validateSchema } = require('./schema');
const { formatSchema } = require('./formatter.schema');

function readEnvFile(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return parse(fs.readFileSync(abs, 'utf8'));
}

function readSchemaFile(schemaPath) {
  const abs = path.resolve(schemaPath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Schema file not found: ${schemaPath}`);
  }
  const raw = fs.readFileSync(abs, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON in schema file: ${schemaPath}`);
  }
}

function runSchemaValidate(envPath, schemaPath, options = {}) {
  const env = readEnvFile(envPath);
  const schema = readSchemaFile(schemaPath);
  const results = validateSchema(env, schema);
  const output = formatSchema(results);

  if (options.silent) return { results, output };

  if (output) {
    console.log(output);
  } else {
    console.log('✓ All schema validations passed.');
  }

  const hasErrors = results.some(r => r.severity === 'error');
  if (!options.noExit && hasErrors) {
    process.exit(1);
  }

  return { results, output };
}

module.exports = { readEnvFile, readSchemaFile, runSchemaValidate };
