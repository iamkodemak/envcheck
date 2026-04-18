const { redact, DEFAULT_PLACEHOLDER } = require('./redact');

describe('redact', () => {
  const env = {
    APP_NAME: 'myapp',
    DB_PASSWORD: 'supersecret',
    API_KEY: 'abc123',
    AUTH_TOKEN: 'tok_xyz',
    PRIVATE_KEY: 'pem_data',
    SECRET_VALUE: 'hidden',
    PORT: '3000',
    NODE_ENV: 'production',
  };

  it('redacts sensitive keys by default', () => {
    const result = redact(env);
    expect(result.DB_PASSWORD).toBe(DEFAULT_PLACEHOLDER);
    expect(result.API_KEY).toBe(DEFAULT_PLACEHOLDER);
    expect(result.AUTH_TOKEN).toBe(DEFAULT_PLACEHOLDER);
    expect(result.PRIVATE_KEY).toBe(DEFAULT_PLACEHOLDER);
    expect(result.SECRET_VALUE).toBe(DEFAULT_PLACEHOLDER);
  });

  it('preserves non-sensitive keys', () => {
    const result = redact(env);
    expect(result.APP_NAME).toBe('myapp');
    expect(result.PORT).toBe('3000');
    expect(result.NODE_ENV).toBe('production');
  });

  it('uses custom placeholder', () => {
    const result = redact(env, { placeholder: '[REDACTED]' });
    expect(result.DB_PASSWORD).toBe('[REDACTED]');
  });

  it('uses custom patterns', () => {
    const result = redact(env, { patterns: [/PORT/] });
    expect(result.PORT).toBe(DEFAULT_PLACEHOLDER);
    expect(result.DB_PASSWORD).toBe('supersecret');
  });

  it('returns empty object for empty input', () => {
    expect(redact({})).toEqual({});
  });

  it('does not mutate original env', () => {
    const original = { DB_PASSWORD: 'secret' };
    redact(original);
    expect(original.DB_PASSWORD).toBe('secret');
  });
});
