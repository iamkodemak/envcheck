const fs = require('fs');
const os = require('os');
const path = require('path');
const { runEncrypt } = require('./cli.encrypt');

function tmpFile(content) {
  const file = path.join(os.tmpdir(), `envcheck-test-${Date.now()}-${Math.random().toString(36).slice(2)}.env`);
  fs.writeFileSync(file, content);
  return file;
}

const SECRET = 'testsecret123';

describe('runEncrypt', () => {
  let spy;
  beforeEach(() => { spy = jest.spyOn(console, 'log').mockImplementation(() => {}); });
  afterEach(() => { spy.mockRestore(); });

  test('encrypts all values and prints output', () => {
    const file = tmpFile('DB_PASS=secret\nAPI_KEY=abc123\n');
    runEncrypt({ file, secret: SECRET, quiet: false });
    const output = spy.mock.calls.map(c => c[0]).join('\n');
    expect(output).toContain('Encrypted');
  });

  test('encrypts only specified keys', () => {
    const file = tmpFile('DB_PASS=secret\nAPP_NAME=myapp\n');
    const outFile = tmpFile('');
    runEncrypt({ file, secret: SECRET, keys: 'DB_PASS', output: outFile, quiet: false });
    const written = fs.readFileSync(outFile, 'utf8');
    expect(written).toMatch(/DB_PASS=enc:/);
    expect(written).toMatch(/APP_NAME=myapp/);
  });

  test('decrypts encrypted values', () => {
    const file = tmpFile('DB_PASS=secret\n');
    const encFile = tmpFile('');
    runEncrypt({ file, secret: SECRET, output: encFile, quiet: true });
    const decFile = tmpFile('');
    runEncrypt({ file: encFile, secret: SECRET, decrypt: true, output: decFile, quiet: true });
    const result = fs.readFileSync(decFile, 'utf8');
    expect(result).toContain('DB_PASS=secret');
  });

  test('exits on missing secret', () => {
    const file = tmpFile('A=1\n');
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => runEncrypt({ file, quiet: false })).toThrow('exit');
    exitSpy.mockRestore();
    errSpy.mockRestore();
  });

  test('exits on missing file', () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => runEncrypt({ file: '/nonexistent.env', secret: SECRET })).toThrow('exit');
    exitSpy.mockRestore();
    errSpy.mockRestore();
  });
});
