const { required } = require('./required');

describe('required', () => {
  const env = {
    DATABASE_URL: 'postgres://localhost/mydb',
    API_KEY: 'abc123',
    SECRET: '',
    PORT: '3000',
  };

  test('returns no missing or empty when all required keys are present and non-empty', () => {
    const result = required(env, ['DATABASE_URL', 'API_KEY', 'PORT']);
    expect(result.missing).toEqual([]);
    expect(result.empty).toEqual([]);
  });

  test('detects missing keys', () => {
    const result = required(env, ['DATABASE_URL', 'REDIS_URL']);
    expect(result.missing).toContain('REDIS_URL');
    expect(result.missing).not.toContain('DATABASE_URL');
  });

  test('detects empty keys', () => {
    const result = required(env, ['SECRET', 'API_KEY']);
    expect(result.empty).toContain('SECRET');
    expect(result.empty).not.toContain('API_KEY');
  });

  test('detects both missing and empty keys', () => {
    const result = required(env, ['SECRET', 'MISSING_KEY', 'API_KEY']);
    expect(result.missing).toContain('MISSING_KEY');
    expect(result.empty).toContain('SECRET');
    expect(result.missing).not.toContain('API_KEY');
    expect(result.empty).not.toContain('API_KEY');
  });

  test('returns empty arrays when requiredKeys is empty', () => {
    const result = required(env, []);
    expect(result.missing).toEqual([]);
    expect(result.empty).toEqual([]);
  });

  test('handles empty env object', () => {
    const result = required({}, ['DATABASE_URL', 'API_KEY']);
    expect(result.missing).toEqual(['DATABASE_URL', 'API_KEY']);
    expect(result.empty).toEqual([]);
  });

  test('does not report missing for keys with falsy but defined values like 0', () => {
    const result = required({ RETRIES: '0' }, ['RETRIES']);
    expect(result.missing).toEqual([]);
    expect(result.empty).toEqual([]);
  });
});
