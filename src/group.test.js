const { group, ungroup } = require('./group');

describe('group', () => {
  it('groups variables by prefix', () => {
    const env = { DB_HOST: 'localhost', DB_PORT: '5432', APP_NAME: 'myapp' };
    const result = group(env);
    expect(result).toEqual({
      DB: { HOST: 'localhost', PORT: '5432' },
      APP: { NAME: 'myapp' },
    });
  });

  it('places keys without delimiter into __ungrouped__', () => {
    const env = { PORT: '3000', DB_HOST: 'localhost' };
    const result = group(env);
    expect(result['__ungrouped__']).toEqual({ PORT: '3000' });
    expect(result['DB']).toEqual({ HOST: 'localhost' });
  });

  it('supports custom delimiter', () => {
    const env = { 'DB.HOST': 'localhost', 'DB.PORT': '5432' };
    const result = group(env, '.');
    expect(result).toEqual({ DB: { HOST: 'localhost', PORT: '5432' } });
  });

  it('returns empty object for empty input', () => {
    expect(group({})).toEqual({});
  });

  it('handles multiple underscores by splitting on first', () => {
    const env = { AWS_SECRET_ACCESS_KEY: 'abc123' };
    const result = group(env);
    expect(result).toEqual({ AWS: { SECRET_ACCESS_KEY: 'abc123' } });
  });
});

describe('ungroup', () => {
  it('flattens grouped object back to flat env', () => {
    const grouped = { DB: { HOST: 'localhost', PORT: '5432' }, APP: { NAME: 'myapp' } };
    expect(ungroup(grouped)).toEqual({
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      APP_NAME: 'myapp',
    });
  });

  it('handles __ungrouped__ keys correctly', () => {
    const grouped = { __ungrouped__: { PORT: '3000' }, DB: { HOST: 'localhost' } };
    expect(ungroup(grouped)).toEqual({ PORT: '3000', DB_HOST: 'localhost' });
  });

  it('round-trips group -> ungroup', () => {
    const env = { DB_HOST: 'localhost', DB_PORT: '5432', PORT: '3000' };
    expect(ungroup(group(env))).toEqual(env);
  });
});
