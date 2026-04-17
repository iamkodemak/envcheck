const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

function tmpFile(content) {
  const p = path.join(os.tmpdir(), `envcheck-merge-${Math.random().toString(36).slice(2)}.env`);
  fs.writeFileSync(p, content, 'utf8');
  return p;
}

function runMerge(args) {
  try {
    const out = execFileSync(process.execPath, ['src/cli.js', 'merge', ...args], {
      encoding: 'utf8',
      env: { ...process.env, NO_COLOR: '1' },
    });
    return { stdout: out, stderr: '', code: 0 };
  } catch (e) {
    return { stdout: e.stdout || '', stderr: e.stderr || '', code: e.status };
  }
}

describe('cli merge', () => {
  test('merges two env files to stdout', () => {
    const a = tmpFile('FOO=foo\nBAR=bar\n');
    const b = tmpFile('BAZ=baz\n');
    const { stdout, code } = runMerge([a, b]);
    expect(code).toBe(0);
    expect(stdout).toContain('FOO=foo');
    expect(stdout).toContain('BAR=bar');
    expect(stdout).toContain('BAZ=baz');
  });

  test('last file wins on conflict', () => {
    const a = tmpFile('KEY=old\n');
    const b = tmpFile('KEY=new\n');
    const { stdout, code } = runMerge([a, b]);
    expect(code).toBe(0);
    expect(stdout).toContain('KEY=new');
  });

  test('writes to --output file', () => {
    const a = tmpFile('X=1\n');
    const b = tmpFile('Y=2\n');
    const out = path.join(os.tmpdir(), `envcheck-out-${Date.now()}.env`);
    const { code } = runMerge([a, b, '--output', out]);
    expect(code).toBe(0);
    const content = fs.readFileSync(out, 'utf8');
    expect(content).toContain('X=1');
    expect(content).toContain('Y=2');
    fs.unlinkSync(out);
  });

  test('exits 1 with fewer than 2 files', () => {
    const a = tmpFile('A=1\n');
    const { code } = runMerge([a]);
    expect(code).toBe(1);
  });

  test('exits 1 for missing file', () => {
    const { code } = runMerge(['/nonexistent/a.env', '/nonexistent/b.env']);
    expect(code).toBe(1);
  });
});
