const { dedupe } = require('./dedupe');

function e(key, value) {
  return { key, value };
}

describe('dedupe', () => {
  test('returns entries unchanged when no duplicates', () => {
    const entries = [e('A', '1'), e('B', '2'), e('C', '3')];
    const { entries: result, duplicates } = dedupe(entries);
    expect(result).toHaveLength(3);
    expect(duplicates).toHaveLength(0);
  });

  test('keeps last occurrence by default', () => {
    const entries = [e('A', 'first'), e('B', '2'), e('A', 'second')];
    const { entries: result, duplicates } = dedupe(entries);
    expect(result).toHaveLength(2);
    const a = result.find((x) => x.key === 'A');
    expect(a.value).toBe('second');
    expect(duplicates).toHaveLength(1);
    expect(duplicates[0].key).toBe('A');
    expect(duplicates[0].kept).toBe('second');
    expect(duplicates[0].dropped).toEqual(['first']);
  });

  test('keeps first occurrence when strategy is first', () => {
    const entries = [e('A', 'first'), e('B', '2'), e('A', 'second')];
    const { entries: result } = dedupe(entries, { strategy: 'first' });
    const a = result.find((x) => x.key === 'A');
    expect(a.value).toBe('first');
  });

  test('handles more than two duplicates', () => {
    const entries = [e('X', 'v1'), e('X', 'v2'), e('X', 'v3')];
    const { entries: result, duplicates } = dedupe(entries);
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('v3');
    expect(duplicates[0].dropped).toEqual(['v1', 'v2']);
  });

  test('preserves order of non-duplicate entries', () => {
    const entries = [e('A', '1'), e('B', '2'), e('A', '3'), e('C', '4')];
    const { entries: result } = dedupe(entries);
    expect(result.map((x) => x.key)).toEqual(['B', 'A', 'C']);
  });

  test('skips entries without a key (comments/blanks)', () => {
    const entries = [{ key: '', value: '' }, e('A', '1'), { key: '', value: '' }];
    const { entries: result, duplicates } = dedupe(entries);
    expect(result).toHaveLength(3);
    expect(duplicates).toHaveLength(0);
  });

  test('returns empty arrays for empty input', () => {
    const { entries: result, duplicates } = dedupe([]);
    expect(result).toEqual([]);
    expect(duplicates).toEqual([]);
  });
});
