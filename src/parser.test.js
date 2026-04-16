const { parse } = require('./parser');

describe('parse()', () => {
  test('parses simple key=value pairs', () => {
    const input = 'FOO=bar\nBAZ=qux';
    expect(parse(input)).toEqual({ FOO: 'bar', BAZ: 'qux' });
  });

  test('ignores comment lines', () => {
    const input = '# This is a comment\nFOO=bar';
    expect(parse(input)).toEqual({ FOO: 'bar' });
  });

  test('ignores empty lines', () => {
    const input = '\nFOO=bar\n\nBAZ=qux\n';
    expect(parse(input)).toEqual({ FOO: 'bar', BAZ: 'qux' });
  });

  test('strips double quotes from values', () => {
    const input = 'FOO="hello world"';
    expect(parse(input)).toEqual({ FOO: 'hello world' });
  });

  test('strips single quotes from values', () => {
    const input = "FOO='hello world'";
    expect(parse(input)).toEqual({ FOO: 'hello world' });
  });

  test('handles values with equals signs', () => {
    const input = 'FOO=bar=baz';
    expect(parse(input)).toEqual({ FOO: 'bar=baz' });
  });

  test('handles empty values', () => {
    const input = 'FOO=';
    expect(parse(input)).toEqual({ FOO: '' });
  });

  test('ignores lines without equals sign', () => {
    const input = 'INVALID_LINE\nFOO=bar';
    expect(parse(input)).toEqual({ FOO: 'bar' });
  });

  test('trims whitespace around keys', () => {
    const input = '  FOO  =bar';
    expect(parse(input)).toEqual({ FOO: 'bar' });
  });

  test('handles windows-style line endings', () => {
    const input = 'FOO=bar\r\nBAZ=qux';
    expect(parse(input)).toEqual({ FOO: 'bar', BAZ: 'qux' });
  });
});
