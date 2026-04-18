const { transform, transformers } = require('./transform');

describe('transformers', () => {
  test('uppercase', () => expect(transformers.uppercase('hello')).toBe('HELLO'));
  test('lowercase', () => expect(transformers.lowercase('WORLD')).toBe('world'));
  test('trim', () => expect(transformers.trim('  hi  ')).toBe('hi'));
  test('mask short value', () => expect(transformers.mask('ab')).toBe('****'));
  test('mask long value', () => expect(transformers.mask('abcdef')).toBe('ab**ef'));
  test('boolean true variants', () => {
    expect(transformers.boolean('yes')).toBe('true');
    expect(transformers.boolean('1')).toBe('true');
    expect(transformers.boolean('TRUE')).toBe('true');
  });
  test('boolean false variants', () => {
    expect(transformers.boolean('no')).toBe('false');
    expect(transformers.boolean('0')).toBe('false');
  });
  test('boolean unknown passthrough', () => expect(transformers.boolean('maybe')).toBe('maybe'));
});

describe('transform()', () => {
  const env = { HOST: '  localhost  ', PORT: '3000', SECRET: 'abcdef', DEBUG: 'yes' };

  test('applies trim to specific key', () => {
    const { result, warnings } = transform(env, [{ key: 'HOST', transform: 'trim' }]);
    expect(result.HOST).toBe('localhost');
    expect(warnings).toHaveLength(0);
  });

  test('applies uppercase to all keys', () => {
    const { result } = transform({ A: 'foo', B: 'bar' }, [{ key: '*', transform: 'uppercase' }]);
    expect(result).toEqual({ A: 'FOO', B: 'BAR' });
  });

  test('warns on unknown transformer', () => {
    const { warnings } = transform(env, [{ key: 'PORT', transform: 'nonexistent' }]);
    expect(warnings[0]).toMatch(/Unknown transformer/);
  });

  test('warns on missing key', () => {
    const { warnings } = transform(env, [{ key: 'MISSING', transform: 'trim' }]);
    expect(warnings[0]).toMatch(/Key not found/);
  });

  test('does not mutate original env', () => {
    const original = { KEY: 'value' };
    transform(original, [{ key: 'KEY', transform: 'uppercase' }]);
    expect(original.KEY).toBe('value');
  });
});
