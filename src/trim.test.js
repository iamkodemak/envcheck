const { trim } = require('./trim');

describe('trim', () => {
  const entries = [
    { key: 'FOO', value: '  hello  ' },
    { key: 'BAR', value: 'world' },
    { key: 'BAZ', value: '\t spaced\t' },
    { key: 'EMPTY', value: '' },
    { key: 'NOCHANGE', value: 'clean' },
  ];

  it('trims all values by default', () => {
    const { entries: result, changes } = trim(entries);
    expect(result.find((e) => e.key === 'FOO').value).toBe('hello');
    expect(result.find((e) => e.key === 'BAZ').value).toBe('spaced');
    expect(result.find((e) => e.key === 'BAR').value).toBe('world');
    expect(result.find((e) => e.key === 'EMPTY').value).toBe('');
    expect(changes).toHaveLength(2);
  });

  it('reports correct change metadata', () => {
    const { changes } = trim(entries);
    const fooChange = changes.find((c) => c.key === 'FOO');
    expect(fooChange).toBeDefined();
    expect(fooChange.original).toBe('  hello  ');
    expect(fooChange.trimmed).toBe('hello');
  });

  it('trims only specified keys when keys option provided', () => {
    const { entries: result, changes } = trim(entries, { keys: ['FOO'] });
    expect(result.find((e) => e.key === 'FOO').value).toBe('hello');
    expect(result.find((e) => e.key === 'BAZ').value).toBe('\t spaced\t');
    expect(changes).toHaveLength(1);
  });

  it('returns no changes when nothing to trim', () => {
    const clean = [{ key: 'A', value: 'clean' }, { key: 'B', value: 'also' }];
    const { entries: result, changes } = trim(clean);
    expect(changes).toHaveLength(0);
    expect(result).toEqual(clean);
  });

  it('does not mutate original entries', () => {
    const original = [{ key: 'X', value: '  padded  ' }];
    trim(original);
    expect(original[0].value).toBe('  padded  ');
  });

  it('preserves comment field on entries', () => {
    const withComment = [{ key: 'C', value: '  val  ', comment: '# note' }];
    const { entries: result } = trim(withComment);
    expect(result[0].comment).toBe('# note');
    expect(result[0].value).toBe('val');
  });

  it('handles entries with null or undefined values gracefully', () => {
    const weird = [{ key: 'D', value: null }, { key: 'E', value: undefined }];
    expect(() => trim(weird)).not.toThrow();
  });
});
