const { flatten, unflatten } = require('./flatten');

describe('flatten', () => {
  test('flattens a nested object into dot-notation keys', () => {
    const input = { DB: { HOST: 'localhost', PORT: '5432' }, APP: { NAME: 'envcheck' } };
    expect(flatten(input)).toEqual({
      'DB.HOST': 'localhost',
      'DB.PORT': '5432',
      'APP.NAME': 'envcheck',
    });
  });

  test('handles top-level scalar values unchanged', () => {
    const input = { HOST: 'localhost', PORT: '3000' };
    expect(flatten(input)).toEqual({ HOST: 'localhost', PORT: '3000' });
  });

  test('handles deeply nested objects', () => {
    const input = { A: { B: { C: 'deep' } } };
    expect(flatten(input)).toEqual({ 'A.B.C': 'deep' });
  });

  test('converts non-string values to strings', () => {
    const input = { ENABLED: true, COUNT: 42 };
    expect(flatten(input)).toEqual({ ENABLED: 'true', COUNT: '42' });
  });

  test('handles null values as empty string', () => {
    const input = { KEY: null };
    expect(flatten(input)).toEqual({ KEY: '' });
  });

  test('returns empty object for empty input', () => {
    expect(flatten({})).toEqual({});
  });
});

describe('unflatten', () => {
  test('unflattens dot-notation keys into nested object', () => {
    const input = { 'DB.HOST': 'localhost', 'DB.PORT': '5432', 'APP.NAME': 'envcheck' };
    expect(unflatten(input)).toEqual({
      DB: { HOST: 'localhost', PORT: '5432' },
      APP: { NAME: 'envcheck' },
    });
  });

  test('handles top-level keys without dots', () => {
    const input = { HOST: 'localhost', PORT: '3000' };
    expect(unflatten(input)).toEqual({ HOST: 'localhost', PORT: '3000' });
  });

  test('handles deeply nested keys', () => {
    const input = { 'A.B.C': 'deep' };
    expect(unflatten(input)).toEqual({ A: { B: { C: 'deep' } } });
  });

  test('returns empty object for empty input', () => {
    expect(unflatten({})).toEqual({});
  });

  test('flatten and unflatten are inverse operations', () => {
    const original = { DB: { HOST: 'localhost', PORT: '5432' }, API_KEY: 'secret' };
    expect(unflatten(flatten(original))).toEqual({
      DB: { HOST: 'localhost', PORT: '5432' },
      API_KEY: 'secret',
    });
  });
});
