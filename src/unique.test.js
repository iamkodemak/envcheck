const { unique } = require('./unique');

const e = (key, value, comment) =>
  comment ? { key, value, comment } : { key, value };

describe('unique', () => {
  it('returns all entries when no duplicates exist', () => {
    const entries = [e('A', '1'), e('B', '2'), e('C', '3')];
    const { unique: u, duplicates } = unique(entries);
    expect(u).toHaveLength(3);
    expect(duplicates).toHaveLength(0);
  });

  it('removes duplicate keys, keeping first occurrence', () => {
    const entries = [e('A', '1'), e('B', '2'), e('A', '99')];
    const { unique: u, duplicates } = unique(entries);
    expect(u).toHaveLength(2);
    expect(u[0]).toMatchObject({ key: 'A', value: '1' });
    expect(duplicates).toHaveLength(1);
    expect(duplicates[0]).toMatchObject({ key: 'A', value: '99' });
  });

  it('deduplicates by value when byValue=true', () => {
    const entries = [e('A', 'same'), e('B', 'other'), e('C', 'same')];
    const { unique: u, duplicates } = unique(entries, { byValue: true });
    expect(u).toHaveLength(2);
    expect(u.map(x => x.key)).toEqual(['A', 'B']);
    expect(duplicates).toHaveLength(1);
    expect(duplicates[0].key).toBe('C');
  });

  it('handles empty input', () => {
    const { unique: u, duplicates } = unique([]);
    expect(u).toHaveLength(0);
    expect(duplicates).toHaveLength(0);
  });

  it('preserves comments on unique entries', () => {
    const entries = [e('A', '1', '# comment'), e('B', '2')];
    const { unique: u } = unique(entries);
    expect(u[0].comment).toBe('# comment');
  });

  it('records firstSeenKey on duplicate entries', () => {
    const entries = [e('X', 'foo'), e('X', 'bar')];
    const { duplicates } = unique(entries);
    expect(duplicates[0].firstSeenKey).toBe('X');
  });
});
