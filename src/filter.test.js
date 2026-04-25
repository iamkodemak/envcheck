const { filter } = require('./filter');

const env = {
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_NAME: 'mydb',
  APP_NAME: 'envcheck',
  APP_PORT: '3000',
  SECRET_KEY: 'abc123',
  DEBUG: 'false',
};

describe('filter', () => {
  it('returns all entries when no pattern given', () => {
    expect(filter(env)).toEqual(env);
  });

  it('filters by key prefix string pattern', () => {
    const result = filter(env, { keyPattern: '^DB_' });
    expect(Object.keys(result)).toEqual(['DB_HOST', 'DB_PORT', 'DB_NAME']);
  });

  it('filters by key using RegExp', () => {
    const result = filter(env, { keyPattern: /^APP_/ });
    expect(Object.keys(result)).toEqual(['APP_NAME', 'APP_PORT']);
  });

  it('filters by value pattern', () => {
    const result = filter(env, { valuePattern: '^\\d+$' });
    expect(result).toEqual({ DB_PORT: '5432', APP_PORT: '3000' });
  });

  it('filters by both key and value pattern', () => {
    const result = filter(env, { keyPattern: '^APP_', valuePattern: '^\\d+$' });
    expect(result).toEqual({ APP_PORT: '3000' });
  });

  it('inverts the match (exclude)', () => {
    const result = filter(env, { keyPattern: '^DB_', invert: true });
    expect(Object.keys(result)).not.toContain('DB_HOST');
    expect(result).toHaveProperty('APP_NAME');
    expect(result).toHaveProperty('SECRET_KEY');
  });

  it('returns empty object when nothing matches', () => {
    const result = filter(env, { keyPattern: '^NONEXISTENT_' });
    expect(result).toEqual({});
  });

  it('does not mutate the original env', () => {
    const copy = { ...env };
    filter(env, { keyPattern: '^DB_' });
    expect(env).toEqual(copy);
  });
});
