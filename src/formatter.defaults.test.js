const { formatDefaults } = require('./formatter.defaults');

describe('formatDefaults', () => {
  test('shows added keys with + prefix', () => {
    const output = formatDefaults({ added: ['FOO', 'BAR'], skipped: [] });
    expect(output).toContain('+ FOO');
    expect(output).toContain('+ BAR');
  });

  test('shows summary line', () => {
    const output = formatDefaults({ added: ['X'], skipped: ['Y'] });
    expect(output).toContain('Applied 1 default(s), skipped 1.');
  });

  test('shows skipped keys when not quiet', () => {
    const output = formatDefaults({ added: ['A'], skipped: ['B', 'C'] });
    expect(output).toContain('B, C');
  });

  test('hides skipped keys in quiet mode', () => {
    const output = formatDefaults({ added: ['A'], skipped: ['B'], quiet: true });
    expect(output).not.toContain('Skipped');
  });

  test('shows complete message when nothing added', () => {
    const output = formatDefaults({ added: [], skipped: ['A', 'B'] });
    expect(output).toContain('already complete');
  });
});
