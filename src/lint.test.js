const { lint } = require('./lint');

const parsed = (raw) => {
  const obj = {};
  raw.split('\n').forEach(line => {
    const t = line.trim();
    if (!t || t.startsWith('#')) return;
    const i = t.indexOf('=');
    if (i !== -1) obj[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  });
  return obj;
};

describe('lint', () => {
  test('no issues for clean file', () => {
    const raw = 'DB_HOST=localhost\nDB_PORT=5432\n';
    expect(lint(parsed(raw), raw)).toEqual([]);
  });

  test('detects duplicate key', () => {
    const raw = 'FOO=bar\nFOO=baz\n';
    const issues = lint(parsed(raw), raw);
    expect(issues.some(i => i.level === 'error' && i.message.includes('duplicate key "FOO"'))).toBe(true);
  });

  test('detects empty value', () => {
    const raw = 'SECRET=\n';
    const issues = lint(parsed(raw), raw);
    expect(issues.some(i => i.level === 'warn' && i.message.includes('empty value'))).toBe(true);
  });

  test('detects non-UPPER_SNAKE_CASE key', () => {
    const raw = 'myKey=value\n';
    const issues = lint(parsed(raw), raw);
    expect(issues.some(i => i.level === 'warn' && i.message.includes('not UPPER_SNAKE_CASE'))).toBe(true);
  });

  test('detects invalid line format', () => {
    const raw = 'INVALID_LINE\n';
    const issues = lint(parsed(raw), raw);
    expect(issues.some(i => i.level === 'error' && i.message.includes("no '=' found"))).toBe(true);
  });

  test('ignores comments and blank lines', () => {
    const raw = '# comment\n\nVALID=yes\n';
    expect(lint(parsed(raw), raw)).toEqual([]);
  });

  test('multiple issues in one file', () => {
    const raw = 'bad_key=\nFOO=a\nFOO=b\n';
    const issues = lint(parsed(raw), raw);
    expect(issues.length).toBeGreaterThanOrEqual(3);
  });
});
