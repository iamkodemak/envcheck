const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function tmpFile(content, ext = '.env') {
  const file = path.join(os.tmpdir(), `envcheck_${Date.now()}${ext}`);
  fs.writeFileSync(file, content);
  return file;
}

function run(args) {
  try {
    const output = execSync(`node src/cli.js ${args} --no-color`, { encoding: 'utf-8' });
    return { stdout: output, code: 0 };
  } catch (err) {
    return { stdout: err.stdout, stderr: err.stderr, code: err.status };
  }
}

describe('CLI diff command', () => {
  it('exits 0 and reports no differences for identical files', () => {
    const a = tmpFile('KEY=value\nFOO=bar');
    const b = tmpFile('KEY=value\nFOO=bar');
    const { stdout, code } = run(`diff ${a} ${b}`);
    expect(code).toBe(0);
    expect(stdout).toContain('No differences found.');
  });

  it('exits 1 when keys differ', () => {
    const a = tmpFile('KEY=value\nEXTRA=1');
    const b = tmpFile('KEY=value');
    const { code, stdout } = run(`diff ${a} ${b}`);
    expect(code).toBe(1);
    expect(stdout).toContain('EXTRA');
  });
});

describe('CLI validate command', () => {
  it('exits 0 when all required keys are present', () => {
    const env = tmpFile('API_KEY=abc\nDB_URL=postgres://localhost');
    const schema = tmpFile(JSON.stringify({ required: ['API_KEY', 'DB_URL'] }), '.json');
    const { code, stdout } = run(`validate ${env} ${schema}`);
    expect(code).toBe(0);
    expect(stdout).toContain('All validations passed.');
  });

  it('exits 1 when required key is missing', () => {
    const env = tmpFile('API_KEY=abc');
    const schema = tmpFile(JSON.stringify({ required: ['API_KEY', 'DB_URL'] }), '.json');
    const { code, stdout } = run(`validate ${env} ${schema}`);
    expect(code).toBe(1);
    expect(stdout).toContain('DB_URL');
  });
});

describe('CLI unknown command', () => {
  it('exits 1 for unknown commands', () => {
    const { code } = run('unknown');
    expect(code).toBe(1);
  });
});
