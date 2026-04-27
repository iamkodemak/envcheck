const { normalize, stripQuotes } = require('./normalize');

describe('stripQuotes', () => {
  it('strips double quotes', () => {
    expect(stripQuotes('"hello"')).toBe('hello');
  });

  it('strips single quotes', () => {
    expect(stripQuotes("'hello'")).toBe('hello');
  });

  it('does not strip mismatched quotes', () => {
    expect(stripQuotes('"hello\'')).toBe('"hello\'');
  });

  it('returns value unchanged if no quotes', () => {
    expect(stripQuotes('hello')).toBe('hello');
  });

  it('handles empty quoted string', () => {
    expect(stripQuotes('""')).toBe('');
  });
});

describe('normalize', () => {
  it('trims whitespace from values by default', () => {
    const { normalized, changes } = normalize({ KEY: '  value  ' });
    expect(normalized.KEY).toBe('value');
    expect(changes).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'KEY', reason: 'value trimmed' }),
    ]));
  });

  it('unquotes values by default', () => {
    const { normalized, changes } = normalize({ KEY: '"quoted"' });
    expect(normalized.KEY).toBe('quoted');
    expect(changes).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'KEY', reason: 'quotes removed' }),
    ]));
  });

  it('uppercases keys when keys=upper', () => {
    const { normalized, changes } = normalize({ myKey: 'val' }, { keys: 'upper' });
    expect(normalized.MYKEY).toBe('val');
    expect(normalized.myKey).toBeUndefined();
    expect(changes[0]).toMatchObject({ reason: 'key uppercased' });
  });

  it('lowercases keys when keys=lower', () => {
    const { normalized } = normalize({ MY_KEY: 'val' }, { keys: 'lower' });
    expect(normalized.my_key).toBe('val');
  });

  it('does not trim when trimValues=false', () => {
    const { normalized } = normalize({ KEY: '  val  ' }, { trimValues: false });
    expect(normalized.KEY).toBe('  val  ');
  });

  it('does not unquote when unquote=false', () => {
    const { normalized } = normalize({ KEY: '"val"' }, { unquote: false });
    expect(normalized.KEY).toBe('"val"');
  });

  it('returns empty changes when nothing to normalize', () => {
    const { changes } = normalize({ KEY: 'clean' });
    expect(changes).toHaveLength(0);
  });

  it('handles multiple keys', () => {
    const { normalized } = normalize({ A: ' 1 ', B: "'two'" });
    expect(normalized.A).toBe('1');
    expect(normalized.B).toBe('two');
  });

  it('handles empty env object', () => {
    const { normalized, changes } = normalize({});
    expect(normalized).toEqual({});
    expect(changes).toHaveLength(0);
  });
});
