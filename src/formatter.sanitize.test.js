const { formatSanitize } = require('./formatter.sanitize');

describe('formatSanitize', () => {
  test('returns success message when no changes', () => {
    const out = formatSanitize([], { noColor: true });
    expect(out).toMatch(/No sanitization changes/);
  });

  test('lists changed keys with before/after', () => {
    const changes = [
      { key: 'NAME', before: '  Alice  ', after: 'Alice' },
      { key: 'TOKEN', before: 'Bearer x', after: 'x' }
    ];
    const out = formatSanitize(changes, { noColor: true });
    expect(out).toMatch('NAME');
    expect(out).toMatch('Alice');
    expect(out).toMatch('TOKEN');
    expect(out).toMatch('Bearer x');
    expect(out).toMatch('2 value(s) sanitized');
  });

  test('shows JSON-stringified values', () => {
    const changes = [{ key: 'K', before: 'a b', after: 'ab' }];
    const out = formatSanitize(changes, { noColor: true });
    expect(out).toContain('"a b"');
    expect(out).toContain('"ab"');
  });
});
