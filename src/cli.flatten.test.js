const fs = require('fs');
const os = require('os');
const path = require('path');
const { runFlatten } = require('./cli.flatten');

function tmpFile(content) {
  const file = path.join(os.tmpdir(), `envcheck-flatten-${Date.now()}-${Math.random().toString(36).slice(2)}.env`);
  fs.writeFileSync(file, content, 'utf8');
  return file;
}

describe('runFlatten', () => {
  let logs;
  beforeEach(() => {
    logs = [];
    jest.spyOn(console, 'log').mockImplementation((...args) => logs.push(args.join(' ')));
  });
  afterEach(() => jest.restoreAllMocks());

  test('prints flattened output for dot-notation keys', () => {
    const file = tmpFile('DB.HOST=localhost\nDB.PORT=5432\n');
    runFlatten(file, {});
    expect(logs.join('\n')).toMatch('DB.HOST');
    expect(logs.join('\n')).toMatch('localhost');
  });

  test('prints unflattened JSON when unflattenMode is true', () => {
    const file = tmpFile('DB.HOST=localhost\nDB.PORT=5432\n');
    runFlatten(file, { unflattenMode: true });
    const output = logs.join('\n');
    expect(output).toMatch('DB');
    expect(output).toMatch('HOST');
  });

  test('writes flattened output to file when output is specified', () => {
    const file = tmpFile('APP.NAME=envcheck\nAPP.VERSION=1.0\n');
    const out = path.join(os.tmpdir(), `envcheck-flatten-out-${Date.now()}.env`);
    runFlatten(file, { output: out });
    const written = fs.readFileSync(out, 'utf8');
    expect(written).toMatch('APP.NAME=envcheck');
    fs.unlinkSync(out);
  });

  test('writes unflattened JSON to file when unflattenMode + output', () => {
    const file = tmpFile('DB.HOST=localhost\n');
    const out = path.join(os.tmpdir(), `envcheck-unflatten-out-${Date.now()}.json`);
    runFlatten(file, { unflattenMode: true, output: out });
    const written = JSON.parse(fs.readFileSync(out, 'utf8'));
    expect(written).toEqual({ DB: { HOST: 'localhost' } });
    fs.unlinkSync(out);
  });

  test('prints JSON when json option is true', () => {
    const file = tmpFile('KEY=value\n');
    runFlatten(file, { json: true });
    const parsed = JSON.parse(logs.join('\n'));
    expect(parsed).toEqual({ KEY: 'value' });
  });
});
