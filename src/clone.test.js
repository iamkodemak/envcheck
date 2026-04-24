const { clone } = require('./clone');

const source = {
  APP_NAME:  { value: 'myapp', comment: '# app name' },
  APP_PORT:  { value: '3000',  comment: null },
  DB_URL:    { value: 'postgres://localhost/dev', comment: null },
  SECRET_KEY: { value: 'abc123', comment: '# secret' },
};

describe('clone', () => {
  test('clones all entries by default', () => {
    const { result, skipped, overridden } = clone(source);
    expect(Object.keys(result)).toEqual(Object.keys(source));
    expect(skipped).toHaveLength(0);
    expect(overridden).toHaveLength(0);
    expect(result.APP_NAME).toEqual({ value: 'myapp', comment: '# app name' });
  });

  test('only includes specified keys', () => {
    const { result, skipped } = clone(source, { only: ['APP_NAME', 'APP_PORT'] });
    expect(Object.keys(result)).toEqual(['APP_NAME', 'APP_PORT']);
    expect(skipped).toContain('DB_URL');
    expect(skipped).toContain('SECRET_KEY');
  });

  test('excludes specified keys', () => {
    const { result, skipped } = clone(source, { exclude: ['SECRET_KEY'] });
    expect(result).not.toHaveProperty('SECRET_KEY');
    expect(skipped).toContain('SECRET_KEY');
    expect(Object.keys(result)).toHaveLength(3);
  });

  test('applies overrides to existing keys', () => {
    const { result, overridden } = clone(source, { overrides: { APP_PORT: '8080' } });
    expect(result.APP_PORT.value).toBe('8080');
    expect(result.APP_PORT.comment).toBeNull();
    expect(overridden).toContain('APP_PORT');
  });

  test('appends override keys not in source', () => {
    const { result, overridden } = clone(source, { overrides: { NEW_VAR: 'hello' } });
    expect(result.NEW_VAR).toEqual({ value: 'hello', comment: null });
    expect(overridden).toContain('NEW_VAR');
  });

  test('only + overrides: override on included key', () => {
    const { result } = clone(source, { only: ['APP_PORT'], overrides: { APP_PORT: '9000' } });
    expect(result.APP_PORT.value).toBe('9000');
    expect(Object.keys(result)).toHaveLength(1);
  });

  test('exclude takes priority; overridden key in exclude is skipped', () => {
    const { result, skipped } = clone(source, {
      exclude: ['SECRET_KEY'],
      overrides: { SECRET_KEY: 'new-secret' },
    });
    expect(result).not.toHaveProperty('SECRET_KEY');
    expect(skipped).toContain('SECRET_KEY');
  });

  test('preserves comments on non-overridden entries', () => {
    const { result } = clone(source);
    expect(result.APP_NAME.comment).toBe('# app name');
  });
});
