import fs from 'fs';
import os from 'os';
import path from 'path';
import { runSplit } from './cli.split.js';

function tmpFile(content) {
  const file = path.join(os.tmpdir(), `envcheck-split-${Date.now()}-${Math.random().toString(36).slice(2)}.env`);
  fs.writeFileSync(file, content);
  return file;
}

const sampleEnv = `DB_HOST=localhost
DB_PORT=5432
AWS_KEY=abc
AWS_SECRET=xyz
PORT=3000
`;

describe('runSplit CLI', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'envcheck-split-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('writes split files to outDir', () => {
    const input = tmpFile(sampleEnv);
    runSplit(input, ['DB_', 'AWS_'], { outDir: tmpDir, color: false });
    const files = fs.readdirSync(tmpDir);
    expect(files).toContain('.env.db_');
    expect(files).toContain('.env.aws_');
    expect(files).toContain('.env.other');
  });

  test('written db file contains correct keys', () => {
    const input = tmpFile(sampleEnv);
    runSplit(input, ['DB_'], { outDir: tmpDir, color: false });
    const content = fs.readFileSync(path.join(tmpDir, '.env.db_'), 'utf8');
    expect(content).toContain('DB_HOST=localhost');
    expect(content).toContain('DB_PORT=5432');
  });

  test('exits with error when no input file provided', () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => runSplit(null, ['DB_'])).toThrow('exit');
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
    errSpy.mockRestore();
  });

  test('exits with error when no prefixes provided', () => {
    const input = tmpFile(sampleEnv);
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => runSplit(input, [])).toThrow('exit');
    exitSpy.mockRestore();
    errSpy.mockRestore();
  });
});
