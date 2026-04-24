const { promote } = require('./promote');

const source = {
  DB_HOST: 'prod-db.example.com',
  DB_PORT: '5432',
  API_KEY: 'secret-prod',
  APP_ENV: 'production',
};

const target = {
  DB_HOST: 'staging-db.example.com',
  DB_PORT: '5432',
  APP_DEBUG: 'true',
};

describe('promote', () => {
  test('promotes all source keys to target by default', () => {
    const { result, promoted, skipped } = promote(source, target);
    expect(result.DB_HOST).toBe('prod-db.example.com');
    expect(result.API_KEY).toBe('secret-prod');
    expect(result.APP_DEBUG).toBe('true'); // target-only key preserved
    expect(promoted).toHaveLength(4);
    expect(skipped).toHaveLength(0);
  });

  test('promotes only specified keys', () => {
    const { result, promoted } = promote(source, target, { keys: ['API_KEY'] });
    expect(result.API_KEY).toBe('secret-prod');
    expect(result.DB_HOST).toBe('staging-db.example.com'); // unchanged
    expect(promoted).toEqual(['API_KEY']);
  });

  test('promotes keys matching prefix', () => {
    const { result, promoted } = promote(source, target, { prefix: 'DB_' });
    expect(result.DB_HOST).toBe('prod-db.example.com');
    expect(result.DB_PORT).toBe('5432');
    expect(result.API_KEY).toBeUndefined();
    expect(promoted).toEqual(['DB_HOST', 'DB_PORT']);
  });

  test('skips existing keys when overwrite is false', () => {
    const { result, promoted, skipped } = promote(source, target, {
      prefix: 'DB_',
      overwrite: false,
    });
    expect(result.DB_HOST).toBe('staging-db.example.com'); // not overwritten
    expect(skipped).toContain('DB_HOST');
    expect(promoted).toContain('DB_PORT');
  });

  test('returns empty promoted/skipped for unknown keys', () => {
    const { promoted, skipped } = promote(source, target, { keys: ['NONEXISTENT'] });
    expect(promoted).toHaveLength(0);
    expect(skipped).toHaveLength(0);
  });

  test('does not mutate source or target', () => {
    const srcCopy = { ...source };
    const tgtCopy = { ...target };
    promote(source, target);
    expect(source).toEqual(srcCopy);
    expect(target).toEqual(tgtCopy);
  });
});
