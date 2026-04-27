const { addPrefix, removePrefix } = require('./prefix');

describe('addPrefix', () => {
  test('adds prefix to all keys', () => {
    const env = { FOO: 'bar', BAZ: 'qux' };
    expect(addPrefix(env, 'APP_')).toEqual({ APP_FOO: 'bar', APP_BAZ: 'qux' });
  });

  test('returns copy when prefix is empty string', () => {
    const env = { FOO: 'bar' };
    expect(addPrefix(env, '')).toEqual({ FOO: 'bar' });
  });

  test('does not mutate original', () => {
    const env = { FOO: 'bar' };
    addPrefix(env, 'X_');
    expect(env).toEqual({ FOO: 'bar' });
  });

  test('handles empty env', () => {
    expect(addPrefix({}, 'APP_')).toEqual({});
  });
});

describe('removePrefix', () => {
  test('removes prefix from matching keys', () => {
    const env = { APP_FOO: 'bar', APP_BAZ: 'qux' };
    expect(removePrefix(env, 'APP_')).toEqual({ FOO: 'bar', BAZ: 'qux' });
  });

  test('keeps non-matching keys by default', () => {
    const env = { APP_FOO: 'bar', OTHER: 'val' };
    expect(removePrefix(env, 'APP_')).toEqual({ FOO: 'bar', OTHER: 'val' });
  });

  test('drops non-matching keys in strict mode', () => {
    const env = { APP_FOO: 'bar', OTHER: 'val' };
    expect(removePrefix(env, 'APP_', { strict: true })).toEqual({ FOO: 'bar' });
  });

  test('returns copy when prefix is empty string', () => {
    const env = { FOO: 'bar' };
    expect(removePrefix(env, '')).toEqual({ FOO: 'bar' });
  });

  test('handles empty env', () => {
    expect(removePrefix({}, 'APP_')).toEqual({});
  });

  test('does not mutate original', () => {
    const env = { APP_FOO: 'bar' };
    removePrefix(env, 'APP_');
    expect(env).toEqual({ APP_FOO: 'bar' });
  });
});
