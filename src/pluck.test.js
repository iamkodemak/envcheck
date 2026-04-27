const { pluck } = require('./pluck');

describe('pluck', () => {
  const env = {
    DB_HOST: 'localhost',
    DB_PORT: '5432',
    DB_NAME: 'mydb',
    API_KEY: 'secret',
    DEBUG: 'true',
  };

  it('plucks existing keys', () => {
    const { result, missing } = pluck(env, ['DB_HOST', 'DB_PORT']);
    expect(result).toEqual({ DB_HOST: 'localhost', DB_PORT: '5432' });
    expect(missing).toEqual([]);
  });

  it('returns empty result for empty keys array', () => {
    const { result, missing } = pluck(env, []);
    expect(result).toEqual({});
    expect(missing).toEqual([]);
  });

  it('tracks missing keys', () => {
    const { result, missing } = pluck(env, ['DB_HOST', 'MISSING_KEY']);
    expect(result).toEqual({ DB_HOST: 'localhost' });
    expect(missing).toEqual(['MISSING_KEY']);
  });

  it('throws in strict mode when key is missing', () => {
    expect(() => pluck(env, ['DB_HOST', 'NOT_EXIST'], { strict: true })).toThrow(
      'Missing required key: NOT_EXIST'
    );
  });

  it('does not throw in non-strict mode for missing keys', () => {
    expect(() => pluck(env, ['NOT_EXIST'])).not.toThrow();
  });

  it('plucks all keys when all exist', () => {
    const keys = Object.keys(env);
    const { result, missing } = pluck(env, keys);
    expect(result).toEqual(env);
    expect(missing).toEqual([]);
  });

  it('handles keys with empty string values', () => {
    const envWithEmpty = { ...env, EMPTY_VAL: '' };
    const { result, missing } = pluck(envWithEmpty, ['EMPTY_VAL']);
    expect(result).toEqual({ EMPTY_VAL: '' });
    expect(missing).toEqual([]);
  });
});
