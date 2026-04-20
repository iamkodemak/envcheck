const { sort } = require('./sort');

describe('sort', () => {
  const env = {
    ZEBRA: 'z',
    APP_NAME: 'myapp',
    DB_HOST: 'localhost',
    APP_PORT: '3000',
    ALPHA: 'a',
    DB_USER: 'admin',
  };

  test('sorts keys alphabetically', () => {
    const { sorted } = sort(env);
    const keys = Object.keys(sorted);
    expect(keys).toEqual([...keys].sort());
  });

  test('preserves values after sorting', () => {
    const { sorted } = sort(env);
    expect(sorted['DB_HOST']).toBe('localhost');
    expect(sorted['APP_NAME']).toBe('myapp');
  });

  test('returns null groups when groupByPrefix is false', () => {
    const { groups } = sort(env);
    expect(groups).toBeNull();
  });

  test('groups keys by prefix when groupByPrefix is true', () => {
    const { groups } = sort(env, { groupByPrefix: true });
    expect(groups).not.toBeNull();
    expect(Object.keys(groups['APP'])).toEqual(['APP_NAME', 'APP_PORT']);
    expect(Object.keys(groups['DB'])).toEqual(['DB_HOST', 'DB_USER']);
  });

  test('places keys without underscore in __UNGROUPED__', () => {
    const { groups } = sort(env, { groupByPrefix: true });
    expect(groups['__UNGROUPED__']).toHaveProperty('ALPHA');
    expect(groups['__UNGROUPED__']).toHaveProperty('ZEBRA');
  });

  test('handles empty env object', () => {
    const { sorted, groups } = sort({}, { groupByPrefix: true });
    expect(sorted).toEqual({});
    expect(groups).toEqual({});
  });

  test('sorted object keys are in correct order', () => {
    const { sorted } = sort(env);
    const keys = Object.keys(sorted);
    expect(keys[0]).toBe('ALPHA');
    expect(keys[keys.length - 1]).toBe('ZEBRA');
  });
});
