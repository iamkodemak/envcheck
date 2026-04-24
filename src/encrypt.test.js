const { encrypt, decrypt, encryptValue, decryptValue } = require('./encrypt');

const SECRET = 'supersecretpassword';

describe('encryptValue / decryptValue', () => {
  test('encrypts a value with enc: prefix', () => {
    const result = encryptValue('hello', SECRET);
    expect(result).toMatch(/^enc:/);
  });

  test('decrypts back to original value', () => {
    const encrypted = encryptValue('my-secret-value', SECRET);
    expect(decryptValue(encrypted, SECRET)).toBe('my-secret-value');
  });

  test('throws on non-encrypted value', () => {
    expect(() => decryptValue('plaintext', SECRET)).toThrow('Value is not encrypted');
  });

  test('throws with wrong secret', () => {
    const encrypted = encryptValue('value', SECRET);
    expect(() => decryptValue(encrypted, 'wrongsecret')).toThrow();
  });
});

describe('encrypt', () => {
  test('encrypts all keys when no key filter', () => {
    const parsed = { A: 'foo', B: 'bar' };
    const result = encrypt(parsed, SECRET);
    expect(result.A).toMatch(/^enc:/);
    expect(result.B).toMatch(/^enc:/);
  });

  test('encrypts only specified keys', () => {
    const parsed = { A: 'foo', B: 'bar' };
    const result = encrypt(parsed, SECRET, ['A']);
    expect(result.A).toMatch(/^enc:/);
    expect(result.B).toBe('bar');
  });
});

describe('decrypt', () => {
  test('decrypts all encrypted keys', () => {
    const parsed = { A: 'foo', B: 'bar' };
    const encrypted = encrypt(parsed, SECRET);
    const result = decrypt(encrypted, SECRET);
    expect(result).toEqual({ A: 'foo', B: 'bar' });
  });

  test('skips non-encrypted values', () => {
    const parsed = { A: encryptValue('secret', SECRET), B: 'plain' };
    const result = decrypt(parsed, SECRET);
    expect(result.A).toBe('secret');
    expect(result.B).toBe('plain');
  });

  test('decrypts only specified keys', () => {
    const parsed = encrypt({ A: 'foo', B: 'bar' }, SECRET);
    const result = decrypt(parsed, SECRET, ['A']);
    expect(result.A).toBe('foo');
    expect(result.B).toMatch(/^enc:/);
  });
});
