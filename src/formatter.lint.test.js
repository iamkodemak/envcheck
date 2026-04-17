const { formatLint } = require('./formatter.lint');

describe('formatLint', () => {
  test('shows success message when no issues', () => {
    const out = formatLint('.env', []);
    expect(out).toContain('No issues found');
    expect(out).toContain('.env');
  });

  test('shows errors and warnings', () => {
    const issues = [
      { level: 'error', message: 'Line 1: duplicate key "FOO"' },
      { level: 'warn', message: 'Line 2: key "bar" is not UPPER_SNAKE_CASE' },
    ];
    const out = formatLint('.env.staging', issues);
    expect(out).toContain('[error]');
    expect(out).toContain('[warn]');
    expect(out).toContain('duplicate key');
    expect(out).toContain('UPPER_SNAKE_CASE');
  });

  test('summary counts errors and warnings', () => {
    const issues = [
      { level: 'error', message: 'err1' },
      { level: 'error', message: 'err2' },
      { level: 'warn', message: 'w1' },
    ];
    const out = formatLint('.env', issues);
    expect(out).toContain('2 error(s)');
    expect(out).toContain('1 warning(s)');
  });

  test('includes file path in header', () => {
    const out = formatLint('/path/to/.env.production', [{ level: 'warn', message: 'x' }]);
    expect(out).toContain('/path/to/.env.production');
  });
});
