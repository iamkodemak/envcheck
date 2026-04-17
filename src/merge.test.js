const { merge } = require('./merge');

describe('merge', () => {
  test('merges two non-overlapping envs', () => {
    const a = { FOO: 'foo', BAR: 'bar' };
    const b = { BAZ: 'baz' };
    const { merged, conflicts } = merge(a, b);
    expect(merged).toEqual({ FOO: 'foo', BAR: 'bar', BAZ: 'baz' });
    expect(conflicts).toEqual({});
  });

  test('later source wins on conflict', () => {
    const a = { FOO: 'old' };
    const b = { FOO: 'new' };
    const { merged } = merge(a, b);
    expect(merged.FOO).toBe('new');
  });

  test('reports conflicts for differing values', () => {
    const a = { FOO: 'alpha', SHARED: 'x' };
    const b = { FOO: 'beta', SHARED: 'x' };
    const { conflicts } = merge(a, b);
    expect(conflicts).toHaveProperty('FOO');
    expect(conflicts.FOO).toEqual(['alpha', 'beta']);
    expect(conflicts).not.toHaveProperty('SHARED');
  });

  test('merges three envs, last wins', () => {
    const a = { KEY: '1' };
    const b = { KEY: '2' };
    const c = { KEY: '3' };
    const { merged, conflicts } = merge(a, b, c);
    expect(merged.KEY).toBe('3');
    expect(conflicts.KEY).toEqual(['1', '2', '3']);
  });

  test('empty inputs return empty merged', () => {
    const { merged, conflicts } = merge({}, {});
    expect(merged).toEqual({});
    expect(conflicts).toEqual({});
  });

  test('single env returns itself with no conflicts', () => {
    const a = { A: '1', B: '2' };
    const { merged, conflicts } = merge(a);
    expect(merged).toEqual(a);
    expect(conflicts).toEqual({});
  });
});
