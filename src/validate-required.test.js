'use strict';

const { validateRequired } = require('./validate-required');

describe('validateRequired', () => {
  const env = {
    API_KEY: 'abc123',
    DB_HOST: 'localhost',
    DB_PASS: '',
  };

  test('returns valid when all required keys are present and non-empty', () => {
    const result = validateRequired(env, ['API_KEY', 'DB_HOST']);
    expect(result.valid).toBe(true);
    expect(result.missing).toEqual([]);
    expect(result.empty).toEqual([]);
  });

  test('detects missing keys', () => {
    const result = validateRequired(env, ['API_KEY', 'SECRET']);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain('SECRET');
    expect(result.empty).toEqual([]);
  });

  test('detects empty keys', () => {
    const result = validateRequired(env, ['DB_PASS']);
    expect(result.valid).toBe(false);
    expect(result.empty).toContain('DB_PASS');
    expect(result.missing).toEqual([]);
  });

  test('detects both missing and empty', () => {
    const result = validateRequired(env, ['DB_PASS', 'MISSING_KEY']);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain('MISSING_KEY');
    expect(result.empty).toContain('DB_PASS');
  });

  test('returns valid for empty required list', () => {
    const result = validateRequired(env, []);
    expect(result.valid).toBe(true);
  });

  test('treats whitespace-only values as empty', () => {
    const result = validateRequired({ KEY: '   ' }, ['KEY']);
    expect(result.valid).toBe(false);
    expect(result.empty).toContain('KEY');
  });
});
