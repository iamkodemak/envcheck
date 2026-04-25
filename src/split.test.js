import { split } from './split.js';

const env = {
  DB_HOST: { value: 'localhost', comment: '' },
  DB_PORT: { value: '5432', comment: '' },
  AWS_KEY: { value: 'abc', comment: '' },
  AWS_SECRET: { value: 'xyz', comment: '' },
  APP_NAME: { value: 'myapp', comment: '' },
  PORT: { value: '3000', comment: '' },
};

describe('split', () => {
  test('splits by prefix into groups', () => {
    const result = split(env, ['DB_', 'AWS_']);
    expect(Object.keys(result['DB_'])).toEqual(['DB_HOST', 'DB_PORT']);
    expect(Object.keys(result['AWS_'])).toEqual(['AWS_KEY', 'AWS_SECRET']);
    expect(Object.keys(result['other'])).toEqual(['APP_NAME', 'PORT']);
  });

  test('strips prefix when option is set', () => {
    const result = split(env, ['DB_'], { stripPrefix: true });
    expect(result['DB_']).toHaveProperty('HOST');
    expect(result['DB_']).toHaveProperty('PORT');
    expect(result['DB_']).not.toHaveProperty('DB_HOST');
  });

  test('omits empty groups from result', () => {
    const result = split(env, ['DB_', 'REDIS_']);
    expect(result).not.toHaveProperty('REDIS_');
  });

  test('puts all keys in other when no prefixes match', () => {
    const result = split(env, ['NONEXISTENT_']);
    expect(result).not.toHaveProperty('NONEXISTENT_');
    expect(Object.keys(result['other'])).toHaveLength(6);
  });

  test('handles empty env', () => {
    const result = split({}, ['DB_']);
    expect(result).toEqual({});
  });

  test('preserves comment metadata', () => {
    const envWithComment = {
      DB_HOST: { value: 'localhost', comment: '# primary db' },
    };
    const result = split(envWithComment, ['DB_']);
    expect(result['DB_']['DB_HOST'].comment).toBe('# primary db');
  });
});
