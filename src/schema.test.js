const { validateSchema } = require('./schema');

describe('validateSchema', () => {
  const schema = {
    PORT: { required: true, type: 'number' },
    DEBUG: { required: false, type: 'boolean' },
    API_URL: { required: true, pattern: /^https?:\/\// },
    SECRET: { required: true },
  };

  test('passes with valid env', () => {
    const env = { PORT: '3000', DEBUG: 'true', API_URL: 'https://example.com', SECRET: 'abc' };
    expect(validateSchema(env, schema)).toEqual([]);
  });

  test('reports missing required key', () => {
    const env = { PORT: '3000', API_URL: 'https://example.com' };
    const errors = validateSchema(env, schema);
    expect(errors.some(e => e.key === 'SECRET')).toBe(true);
  });

  test('reports empty required key', () => {
    const env = { PORT: '3000', API_URL: 'https://example.com', SECRET: '' };
    const errors = validateSchema(env, schema);
    expect(errors.some(e => e.key === 'SECRET')).toBe(true);
  });

  test('reports invalid number', () => {
    const env = { PORT: 'abc', API_URL: 'https://example.com', SECRET: 'x' };
    const errors = validateSchema(env, schema);
    expect(errors.some(e => e.key === 'PORT')).toBe(true);
  });

  test('reports invalid boolean', () => {
    const env = { PORT: '3000', DEBUG: 'yes', API_URL: 'https://example.com', SECRET: 'x' };
    const errors = validateSchema(env, schema);
    expect(errors.some(e => e.key === 'DEBUG')).toBe(true);
  });

  test('reports pattern mismatch', () => {
    const env = { PORT: '3000', API_URL: 'ftp://bad.com', SECRET: 'x' };
    const errors = validateSchema(env, schema);
    expect(errors.some(e => e.key === 'API_URL')).toBe(true);
  });

  test('optional key absent causes no error', () => {
    const env = { PORT: '8080', API_URL: 'http://x.com', SECRET: 'y' };
    const errors = validateSchema(env, schema);
    expect(errors.some(e => e.key === 'DEBUG')).toBe(false);
  });
});
