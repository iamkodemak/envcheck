const { resolve } = require('./resolve');

describe('resolve', () => {
  const source = { API_URL: 'http://localhost', DB_HOST: 'localhost', SECRET: 'abc123' };
  const target = { API_URL: 'http://prod.example.com', APP_PORT: '3000' };

  test('fills missing keys from source into target by default', () => {
    const { resolved, added, skipped } = resolve(source, target);
    expect(resolved.DB_HOST).toBe('localhost');
    expect(resolved.SECRET).toBe('abc123');
    expect(added).toEqual(expect.arrayContaining(['DB_HOST', 'SECRET']));
  });

  test('does not overwrite existing keys by default', () => {
    const { resolved, skipped } = resolve(source, target);
    expect(resolved.API_URL).toBe('http://prod.example.com');
    expect(skipped).toContain('API_URL');
  });

  test('preserves keys in target not present in source', () => {
    const { resolved } = resolve(source, target);
    expect(resolved.APP_PORT).toBe('3000');
  });

  test('overwrites existing keys when overwrite=true', () => {
    const { resolved, added } = resolve(source, target, { overwrite: true });
    expect(resolved.API_URL).toBe('http://localhost');
    expect(added).toContain('API_URL');
  });

  test('returns empty added/skipped when source is empty', () => {
    const { resolved, added, skipped } = resolve({}, target);
    expect(resolved).toEqual(target);
    expect(added).toHaveLength(0);
    expect(skipped).toHaveLength(0);
  });

  test('fills all keys when target is empty', () => {
    const { resolved, added } = resolve(source, {});
    expect(resolved).toEqual(source);
    expect(added).toHaveLength(Object.keys(source).length);
  });

  test('onlyMissing=false with overwrite=false still skips existing', () => {
    const { resolved, skipped } = resolve(source, target, { onlyMissing: false, overwrite: false });
    expect(resolved.API_URL).toBe('http://prod.example.com');
    expect(skipped).toContain('API_URL');
  });
});
