'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { runSchemaValidate, readSchemaFile } = require('./cli.schema');

function tmpFile(content) {
  const p = path.join(os.tmpdir(), `envcheck-schema-${Date.now()}-${Math.random()}`);
  fs.writeFileSync(p, content, 'utf8');
  return p;
}

describe('cli.schema', () => {
  it('passes validation with a valid env and schema', () => {
    const envFile = tmpFile('PORT=3000\nNODE_ENV=production\n');
    const schemaFile = tmpFile(JSON.stringify({
      PORT: { required: true, type: 'number' },
      NODE_ENV: { required: true }
    }));
    const { results } = runSchemaValidate(envFile, schemaFile, { silent: true, noExit: true });
    const errors = results.filter(r => r.severity === 'error');
    expect(errors).toHaveLength(0);
  });

  it('reports missing required key', () => {
    const envFile = tmpFile('PORT=3000\n');
    const schemaFile = tmpFile(JSON.stringify({
      PORT: { required: true },
      SECRET: { required: true }
    }));
    const { results } = runSchemaValidate(envFile, schemaFile, { silent: true, noExit: true });
    const errors = results.filter(r => r.severity === 'error');
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(r => r.key === 'SECRET')).toBe(true);
  });

  it('throws if env file not found', () => {
    const schemaFile = tmpFile('{}');
    expect(() => runSchemaValidate('/nonexistent/.env', schemaFile, { silent: true })).toThrow('File not found');
  });

  it('throws if schema file not found', () => {
    const envFile = tmpFile('KEY=val\n');
    expect(() => runSchemaValidate(envFile, '/nonexistent/schema.json', { silent: true })).toThrow('Schema file not found');
  });

  it('throws on invalid JSON schema', () => {
    const envFile = tmpFile('KEY=val\n');
    const schemaFile = tmpFile('not json');
    expect(() => runSchemaValidate(envFile, schemaFile, { silent: true })).toThrow('Invalid JSON');
  });

  it('readSchemaFile parses valid JSON', () => {
    const schemaFile = tmpFile(JSON.stringify({ FOO: { required: false } }));
    const schema = readSchemaFile(schemaFile);
    expect(schema).toHaveProperty('FOO');
  });
});
