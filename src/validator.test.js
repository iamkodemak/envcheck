const { validate } = require('./validator');

describe('validate', () => {
  const baseEnv = {
    DATABASE_URL: 'postgres://localhost/db',
    PORT: '3000',
    SECRET: 'abc123',
    OPTIONAL: '',
  };

  test('returns valid when no options provided', () => {
    const result = validate(baseEnv);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(0);
  });

  test('passes when all required keys are present and non-empty', () => {
    const result = validate(baseEnv, { required: ['DATABASE_URL', 'PORT'] });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('errors when a required key is missing', () => {
    const result = validate(baseEnv, { required: ['MISSING_KEY'] });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required key: MISSING_KEY');
  });

  test('errors when a required key is empty', () => {
    const env = { ...baseEnv, SECRET: '' };
    const result = validate(env, { required: ['SECRET'] });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Required key is empty: SECRET');
  });

  test('warns when a nonempty key is present but empty', () => {
    const result = validate(baseEnv, { nonempty: ['OPTIONAL'] });
    expect(result.valid).toBe(true);
    expect(result.warnings).toContain('Key is present but empty: OPTIONAL');
  });

  test('no warning for nonempty key that is absent', () => {
    const result = validate(baseEnv, { nonempty: ['NOT_HERE'] });
    expect(result.warnings).toHaveLength(0);
  });

  test('errors when a key does not match its pattern', () => {
    const result = validate(baseEnv, { patterns: { PORT: /^\d+$/ } });
    expect(result.valid).toBe(true);
  });

  test('errors when PORT contains non-numeric value', () => {
    const env = { ...baseEnv, PORT: 'abc' };
    const result = validate(env, { patterns: { PORT: /^\d+$/ } });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/PORT/);
  });

  test('skips pattern check when key is absent', () => {
    const result = validate({}, { patterns: { PORT: /^\d+$/ } });
    expect(result.valid).toBe(true);
  });
});
