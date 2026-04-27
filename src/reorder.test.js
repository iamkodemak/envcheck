const { reorder } = require('./reorder');

describe('reorder', () => {
  const env = {
    DB_HOST: 'localhost',
    APP_PORT: '3000',
    APP_NAME: 'myapp',
    DB_PORT: '5432',
    SECRET_KEY: 'abc123',
  };

  test('places specified keys first in given order', () => {
    const result = reorder(env, ['APP_NAME', 'APP_PORT']);
    const keys = Object.keys(result);
    expect(keys[0]).toBe('APP_NAME');
    expect(keys[1]).toBe('APP_PORT');
  });

  test('appends remaining keys after ordered keys', () => {
    const result = reorder(env, ['SECRET_KEY']);
    const keys = Object.keys(result);
    expect(keys[0]).toBe('SECRET_KEY');
    expect(keys).toContain('DB_HOST');
    expect(keys).toContain('APP_PORT');
    expect(keys).toContain('APP_NAME');
    expect(keys).toContain('DB_PORT');
  });

  test('does not duplicate keys', () => {
    const result = reorder(env, ['DB_HOST', 'APP_PORT']);
    const keys = Object.keys(result);
    expect(keys.filter(k => k === 'DB_HOST').length).toBe(1);
  });

  test('silently skips keys in order that are not in env', () => {
    const result = reorder(env, ['NONEXISTENT', 'APP_NAME']);
    const keys = Object.keys(result);
    expect(keys).not.toContain('NONEXISTENT');
    expect(keys[0]).toBe('APP_NAME');
  });

  test('appendRemaining=false omits keys not in order', () => {
    const result = reorder(env, ['APP_NAME', 'DB_HOST'], { appendRemaining: false });
    expect(Object.keys(result)).toEqual(['APP_NAME', 'DB_HOST']);
  });

  test('empty order with appendRemaining=true returns all keys', () => {
    const result = reorder(env, []);
    expect(Object.keys(result)).toEqual(Object.keys(env));
  });

  test('empty order with appendRemaining=false returns empty object', () => {
    const result = reorder(env, [], { appendRemaining: false });
    expect(result).toEqual({});
  });

  test('preserves values correctly', () => {
    const result = reorder(env, ['DB_PORT']);
    expect(result['DB_PORT']).toBe('5432');
    expect(result['APP_NAME']).toBe('myapp');
  });

  test('throws TypeError for non-object env', () => {
    expect(() => reorder(null, [])).toThrow(TypeError);
    expect(() => reorder('string', [])).toThrow(TypeError);
  });

  test('throws TypeError for non-array order', () => {
    expect(() => reorder(env, 'APP_NAME')).toThrow(TypeError);
  });
});
