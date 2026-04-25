const { applyDefaults } = require('./defaults');

describe('applyDefaults', () => {
  const source = { A: '1', B: '2', C: '3' };

  test('adds missing keys from source to target', () => {
    const target = { A: 'existing' };
    const { result, added, skipped } = applyDefaults(source, target);
    expect(result.A).toBe('existing');
    expect(result.B).toBe('2');
    expect(result.C).toBe('3');
    expect(added).toContain('B');
    expect(added).toContain('C');
    expect(skipped).toContain('A');
  });

  test('does not overwrite by default', () => {
    const target = { A: 'keep', B: 'keep' };
    const { result } = applyDefaults(source, target);
    expect(result.A).toBe('keep');
    expect(result.B).toBe('keep');
    expect(result.C).toBe('3');
  });

  test('overwrites when overwrite=true', () => {
    const target = { A: 'old' };
    const { result, added } = applyDefaults(source, target, { overwrite: true });
    expect(result.A).toBe('1');
    expect(added).toContain('A');
  });

  test('returns empty added/skipped for empty source', () => {
    const { result, added, skipped } = applyDefaults({}, { X: '9' });
    expect(result).toEqual({ X: '9' });
    expect(added).toHaveLength(0);
    expect(skipped).toHaveLength(0);
  });

  test('applies all keys when target is empty', () => {
    const { result, added } = applyDefaults(source, {});
    expect(result).toEqual(source);
    expect(added).toEqual(['A', 'B', 'C']);
  });
});
