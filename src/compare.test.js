const { compare } = require('./compare');

describe('compare', () => {
  const base = {
    HOST: 'localhost',
    PORT: '3000',
    DB_URL: 'postgres://localhost/dev',
    SECRET: 'abc123',
  };

  const target = {
    HOST: 'prod.example.com',
    PORT: '3000',
    DB_URL: 'postgres://prod/db',
    API_KEY: 'xyz789',
  };

  it('detects missing keys (in base but not target)', () => {
    const result = compare(base, target);
    expect(result.missing).toEqual(['SECRET']);
  });

  it('detects extra keys (in target but not base)', () => {
    const result = compare(base, target);
    expect(result.extra).toEqual(['API_KEY']);
  });

  it('detects changed values', () => {
    const result = compare(base, target);
    expect(result.changed).toEqual([
      { key: 'HOST', base: 'localhost', target: 'prod.example.com' },
      { key: 'DB_URL', base: 'postgres://localhost/dev', target: 'postgres://prod/db' },
    ]);
  });

  it('detects matching keys', () => {
    const result = compare(base, target);
    expect(result.matching).toEqual(['PORT']);
  });

  it('returns empty arrays when envs are identical', () => {
    const result = compare(base, base);
    expect(result.missing).toHaveLength(0);
    expect(result.extra).toHaveLength(0);
    expect(result.changed).toHaveLength(0);
    expect(result.matching).toHaveLength(4);
  });

  it('handles empty base', () => {
    const result = compare({}, target);
    expect(result.missing).toHaveLength(0);
    expect(result.extra).toEqual(Object.keys(target));
    expect(result.changed).toHaveLength(0);
    expect(result.matching).toHaveLength(0);
  });

  it('handles empty target', () => {
    const result = compare(base, {});
    expect(result.missing).toEqual(Object.keys(base));
    expect(result.extra).toHaveLength(0);
    expect(result.changed).toHaveLength(0);
    expect(result.matching).toHaveLength(0);
  });
});
