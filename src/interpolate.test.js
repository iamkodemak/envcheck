const { interpolate, resolveValue } = require('./interpolate');

describe('resolveValue', () => {
  test('returns plain value unchanged', () => {
    expect(resolveValue('hello', {})).toBe('hello');
  });

  test('expands ${VAR} syntax', () => {
    expect(resolveValue('${HOST}:3000', { HOST: 'localhost' })).toBe('localhost:3000');
  });

  test('expands $VAR syntax', () => {
    expect(resolveValue('$HOST:3000', { HOST: 'localhost' })).toBe('localhost:3000');
  });

  test('leaves unresolved references as-is', () => {
    expect(resolveValue('${MISSING}', {})).toBe('${MISSING}');
  });

  test('expands nested references', () => {
    const env = { BASE: 'http://localhost', URL: '${BASE}/api' };
    expect(resolveValue('${URL}/v1', env)).toBe('http://localhost/api/v1');
  });

  test('throws on circular reference', () => {
    const env = { A: '${B}', B: '${A}' };
    expect(() => resolveValue('${A}', env)).toThrow('Circular reference');
  });
});

describe('interpolate', () => {
  test('interpolates all values', () => {
    const env = { HOST: 'localhost', PORT: '5432', DB_URL: 'postgres://${HOST}:${PORT}/db' };
    const { result, errors } = interpolate(env);
    expect(result.DB_URL).toBe('postgres://localhost:5432/db');
    expect(errors).toHaveLength(0);
  });

  test('returns errors for circular references without throwing', () => {
    const env = { A: '${B}', B: '${A}' };
    const { result, errors } = interpolate(env);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toMatch(/Circular reference/);
  });

  test('leaves values with missing refs unchanged', () => {
    const env = { VAL: '${UNDEFINED}_suffix' };
    const { result, errors } = interpolate(env);
    expect(result.VAL).toBe('${UNDEFINED}_suffix');
    expect(errors).toHaveLength(0);
  });

  test('handles empty env', () => {
    const { result, errors } = interpolate({});
    expect(result).toEqual({});
    expect(errors).toHaveLength(0);
  });

  test('preserves non-reference values', () => {
    const env = { PLAIN: 'value', NUM: '42' };
    const { result } = interpolate(env);
    expect(result).toEqual({ PLAIN: 'value', NUM: '42' });
  });
});
