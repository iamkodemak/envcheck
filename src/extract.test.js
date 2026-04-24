const { extract } = require('./extract');

describe('extract', () => {
  const env = {
    DB_HOST: 'localhost',
    DB_PORT: '5432',
    API_KEY: 'secret',
    DEBUG: 'true',
  };

  test('extracts specified keys', () => {
    const { extracted, missing } = extract(env, ['DB_HOST', 'DB_PORT']);
    expect(extracted).toEqual({ DB_HOST: 'localhost', DB_PORT: '5432' });
    expect(missing).toEqual([]);
  });

  test('returns missing keys when not found', () => {
    const { extracted, missing } = extract(env, ['DB_HOST', 'MISSING_KEY']);
    expect(extracted).toEqual({ DB_HOST: 'localhost' });
    expect(missing).toEqual(['MISSING_KEY']);
  });

  test('returns empty extracted for empty keys array', () => {
    const { extracted, missing } = extract(env, []);
    expect(extracted).toEqual({});
    expect(missing).toEqual([]);
  });

  test('strict mode throws on missing key', () => {
    expect(() => extract(env, ['DB_HOST', 'NOPE'], { strict: true })).toThrow(
      'Key not found in env: NOPE'
    );
  });

  test('strict mode does not throw when all keys present', () => {
    const { extracted } = extract(env, ['API_KEY', 'DEBUG'], { strict: true });
    expect(extracted).toEqual({ API_KEY: 'secret', DEBUG: 'true' });
  });

  test('extracts all keys when all requested keys exist', () => {
    const keys = Object.keys(env);
    const { extracted, missing } = extract(env, keys);
    expect(extracted).toEqual(env);
    expect(missing).toEqual([]);
  });

  test('handles env with no entries', () => {
    const { extracted, missing } = extract({}, ['SOME_KEY']);
    expect(extracted).toEqual({});
    expect(missing).toEqual(['SOME_KEY']);
  });
});
