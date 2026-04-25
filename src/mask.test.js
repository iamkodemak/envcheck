'use strict';

const { mask, maskValue } = require('./mask');

describe('maskValue', () => {
  test('masks entire value by default', () => {
    expect(maskValue('secret123')).toBe('*********');
  });

  test('reveals trailing characters when reveal > 0', () => {
    expect(maskValue('secret123', { reveal: 3 })).toBe('******123');
  });

  test('reveal >= length shows full value', () => {
    expect(maskValue('abc', { reveal: 5 })).toBe('abc');
  });

  test('uses custom masking character', () => {
    expect(maskValue('hello', { char: '#' })).toBe('#####');
  });

  test('returns empty string unchanged', () => {
    expect(maskValue('')).toBe('');
  });

  test('returns non-string values as-is', () => {
    expect(maskValue(undefined)).toBeUndefined();
  });
});

describe('mask', () => {
  const env = {
    API_KEY: 'supersecret',
    DB_PASS: 'p@ssw0rd',
    APP_NAME: 'envcheck',
  };

  test('masks specified keys', () => {
    const result = mask(env, ['API_KEY', 'DB_PASS']);
    expect(result.API_KEY).toBe('***********');
    expect(result.DB_PASS).toBe('********');
    expect(result.APP_NAME).toBe('envcheck');
  });

  test('leaves all values untouched when keys list is empty', () => {
    const result = mask(env, []);
    expect(result).toEqual(env);
  });

  test('passes reveal option through', () => {
    const result = mask(env, ['API_KEY'], { reveal: 4 });
    expect(result.API_KEY).toBe('*******cret');
  });

  test('does not mutate original env object', () => {
    const original = { SECRET: 'abc' };
    mask(original, ['SECRET']);
    expect(original.SECRET).toBe('abc');
  });

  test('throws on non-object env', () => {
    expect(() => mask(null, [])).toThrow(TypeError);
    expect(() => mask('bad', [])).toThrow(TypeError);
  });

  test('ignores keys not present in env', () => {
    const result = mask(env, ['NONEXISTENT']);
    expect(result).toEqual(env);
  });
});
