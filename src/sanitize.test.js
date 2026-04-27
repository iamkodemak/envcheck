const { sanitize } = require('./sanitize');

describe('sanitize', () => {
  const env = {
    NAME: '  Alice  ',
    URL: 'http://example.com',
    BAD: 'hello\x01world',
    NORMAL: 'unchanged'
  };

  test('returns all keys unchanged when no options given', () => {
    const { result, changes } = sanitize(env);
    expect(result).toEqual(env);
    expect(changes).toHaveLength(0);
  });

  test('trims whitespace from values', () => {
    const { result, changes } = sanitize(env, { trimValues: true });
    expect(result.NAME).toBe('Alice');
    expect(changes.find(c => c.key === 'NAME')).toMatchObject({
      before: '  Alice  ',
      after: 'Alice'
    });
    expect(result.NORMAL).toBe('unchanged');
  });

  test('strips control characters', () => {
    const { result, changes } = sanitize(env, { stripControl: true });
    expect(result.BAD).toBe('helloworld');
    expect(changes.find(c => c.key === 'BAD')).toBeDefined();
  });

  test('applies custom regex rules', () => {
    const { result, changes } = sanitize(
      { TOKEN: 'Bearer abc123' },
      { rules: [{ pattern: /^Bearer /, replacement: '' }] }
    );
    expect(result.TOKEN).toBe('abc123');
    expect(changes[0]).toMatchObject({ key: 'TOKEN', before: 'Bearer abc123', after: 'abc123' });
  });

  test('applies multiple rules in order', () => {
    const { result } = sanitize(
      { VAL: '  foo--bar  ' },
      {
        trimValues: true,
        rules: [{ pattern: '--', replacement: '_' }]
      }
    );
    expect(result.VAL).toBe('foo_bar');
  });

  test('does not mutate input', () => {
    const input = { A: '  hi  ' };
    sanitize(input, { trimValues: true });
    expect(input.A).toBe('  hi  ');
  });

  test('reports no changes when value is already clean', () => {
    const { changes } = sanitize({ X: 'clean' }, { trimValues: true, stripControl: true });
    expect(changes).toHaveLength(0);
  });
});
