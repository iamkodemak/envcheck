const { diff } = require('./diff');

describe('diff', () => {
  const base = {
    APP_NAME: 'myapp',
    DB_HOST: 'localhost',
    DB_PORT: '5432',
    SECRET_KEY: 'base-secret',
  };

  test('returns no diff for identical objects', () => {
    const result = diff(base, { ...base });
    expect(result.hasDiff).toBe(false);
    expect(result.missing).toHaveLength(0);
    expect(result.extra).toHaveLength(0);
    expect(result.changed).toHaveLength(0);
    expect(result.matching).toHaveLength(4);
  });

  test('detects missing keys in target', () => {
    const target = { APP_NAME: 'myapp', DB_HOST: 'localhost' };
    const result = diff(base, target);
    expect(result.missing).toHaveLength(2);
    expect(result.missing.map(m => m.key)).toContain('DB_PORT');
    expect(result.missing.map(m => m.key)).toContain('SECRET_KEY');
    expect(result.hasDiff).toBe(true);
  });

  test('detects extra keys in target', () => {
    const target = { ...base, EXTRA_VAR: 'extra' };
    const result = diff(base, target);
    expect(result.extra).toHaveLength(1);
    expect(result.extra[0].key).toBe('EXTRA_VAR');
    expect(result.extra[0].targetValue).toBe('extra');
    expect(result.hasDiff).toBe(true);
  });

  test('detects changed values', () => {
    const target = { ...base, DB_HOST: 'prod-db.example.com' };
    const result = diff(base, target);
    expect(result.changed).toHaveLength(1);
    expect(result.changed[0].key).toBe('DB_HOST');
    expect(result.changed[0].baseValue).toBe('localhost');
    expect(result.changed[0].targetValue).toBe('prod-db.example.com');
    expect(result.hasDiff).toBe(true);
  });

  test('handles empty base and target', () => {
    const result = diff({}, {});
    expect(result.hasDiff).toBe(false);
    expect(result.matching).toHaveLength(0);
  });

  test('handles empty base with populated target', () => {
    const result = diff({}, { FOO: 'bar' });
    expect(result.extra).toHaveLength(1);
    expect(result.hasDiff).toBe(true);
  });
});
