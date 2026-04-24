const { patch } = require('./patch');

describe('patch', () => {
  const base = { FOO: 'foo', BAR: 'bar', BAZ: 'baz' };

  test('set adds a new key', () => {
    const { result } = patch(base, [{ op: 'set', key: 'NEW', value: 'val' }]);
    expect(result.NEW).toBe('val');
    expect(result.FOO).toBe('foo');
  });

  test('set overwrites an existing key', () => {
    const { result } = patch(base, [{ op: 'set', key: 'FOO', value: 'updated' }]);
    expect(result.FOO).toBe('updated');
  });

  test('unset removes an existing key', () => {
    const { result, applied } = patch(base, [{ op: 'unset', key: 'BAR' }]);
    expect('BAR' in result).toBe(false);
    expect(applied).toHaveLength(1);
  });

  test('unset skips missing key', () => {
    const { skipped } = patch(base, [{ op: 'unset', key: 'MISSING' }]);
    expect(skipped).toHaveLength(1);
  });

  test('rename moves key and preserves value', () => {
    const { result } = patch(base, [{ op: 'rename', key: 'BAZ', newKey: 'BAZ_NEW' }]);
    expect('BAZ' in result).toBe(false);
    expect(result.BAZ_NEW).toBe('baz');
  });

  test('rename skips when source key missing', () => {
    const { skipped } = patch(base, [{ op: 'rename', key: 'NOPE', newKey: 'X' }]);
    expect(skipped).toHaveLength(1);
  });

  test('unknown op is skipped', () => {
    const { skipped } = patch(base, [{ op: 'delete', key: 'FOO' }]);
    expect(skipped).toHaveLength(1);
  });

  test('multiple ops applied in order', () => {
    const ops = [
      { op: 'set', key: 'FOO', value: 'x' },
      { op: 'unset', key: 'BAR' },
      { op: 'rename', key: 'BAZ', newKey: 'BAZ2' },
    ];
    const { result, applied } = patch(base, ops);
    expect(result.FOO).toBe('x');
    expect('BAR' in result).toBe(false);
    expect(result.BAZ2).toBe('baz');
    expect(applied).toHaveLength(3);
  });

  test('set without value is skipped', () => {
    const { skipped } = patch(base, [{ op: 'set', key: 'FOO' }]);
    expect(skipped).toHaveLength(1);
  });

  test('does not mutate original env', () => {
    patch(base, [{ op: 'set', key: 'FOO', value: 'mutated' }]);
    expect(base.FOO).toBe('foo');
  });

  test('throws on non-array ops', () => {
    expect(() => patch(base, null)).toThrow(TypeError);
  });
});
