const { rename } = require('./rename');

describe('rename', () => {
  const env = { DB_HOST: 'localhost', DB_PORT: '5432', APP_ENV: 'production' };

  test('renames a single key', () => {
    const { result, renamed, notFound } = rename(env, { DB_HOST: 'DATABASE_HOST' });
    expect(result.DATABASE_HOST).toBe('localhost');
    expect(result.DB_HOST).toBeUndefined();
    expect(renamed).toEqual([{ from: 'DB_HOST', to: 'DATABASE_HOST' }]);
    expect(notFound).toEqual([]);
  });

  test('renames multiple keys', () => {
    const { result, renamed } = rename(env, { DB_HOST: 'DATABASE_HOST', DB_PORT: 'DATABASE_PORT' });
    expect(result.DATABASE_HOST).toBe('localhost');
    expect(result.DATABASE_PORT).toBe('5432');
    expect(renamed).toHaveLength(2);
  });

  test('tracks keys not found', () => {
    const { notFound } = rename(env, { MISSING_KEY: 'NEW_KEY' });
    expect(notFound).toEqual(['MISSING_KEY']);
  });

  test('does not mutate original env', () => {
    rename(env, { DB_HOST: 'DATABASE_HOST' });
    expect(env.DB_HOST).toBe('localhost');
  });

  test('returns unchanged result when map is empty', () => {
    const { result, renamed, notFound } = rename(env, {});
    expect(result).toEqual(env);
    expect(renamed).toEqual([]);
    expect(notFound).toEqual([]);
  });

  test('handles renaming to existing key (overwrite)', () => {
    const { result } = rename({ A: '1', B: '2' }, { A: 'B' });
    expect(result.B).toBe('1');
    expect(result.A).toBeUndefined();
  });
});
