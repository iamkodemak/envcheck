const fs = require('fs');
const os = require('os');
const path = require('path');
const { runPromote } = require('./cli.promote');

function tmpFile(content) {
  const p = path.join(os.tmpdir(), `envcheck-promote-${Math.random().toString(36).slice(2)}.env`);
  fs.writeFileSync(p, content, 'utf8');
  return p;
}

describe('runPromote', () => {
  let src, tgt;

  beforeEach(() => {
    src = tmpFile('DB_HOST=prod-db\nDB_PORT=5432\nAPI_KEY=secret\n');
    tgt = tmpFile('DB_HOST=staging-db\nAPP_DEBUG=true\n');
  });

  afterEach(() => {
    [src, tgt].forEach((f) => fs.existsSync(f) && fs.unlinkSync(f));
  });

  test('promotes all source keys into target file', () => {
    runPromote({ source: src, target: tgt });
    const written = fs.readFileSync(tgt, 'utf8');
    expect(written).toContain('DB_HOST=prod-db');
    expect(written).toContain('API_KEY=secret');
    expect(written).toContain('APP_DEBUG=true');
  });

  test('promotes only specified keys', () => {
    runPromote({ source: src, target: tgt, keys: 'API_KEY' });
    const written = fs.readFileSync(tgt, 'utf8');
    expect(written).toContain('API_KEY=secret');
    expect(written).toContain('DB_HOST=staging-db'); // unchanged
  });

  test('dry-run does not write file', () => {
    const before = fs.readFileSync(tgt, 'utf8');
    runPromote({ source: src, target: tgt, dryRun: true });
    expect(fs.readFileSync(tgt, 'utf8')).toBe(before);
  });

  test('writes to custom output file', () => {
    const out = tmpFile('');
    try {
      runPromote({ source: src, target: tgt, output: out });
      const written = fs.readFileSync(out, 'utf8');
      expect(written).toContain('DB_HOST=prod-db');
    } finally {
      fs.existsSync(out) && fs.unlinkSync(out);
    }
  });

  test('throws when source file missing', () => {
    expect(() => runPromote({ source: '/no/such.env', target: tgt })).toThrow('File not found');
  });
});
