'use strict';

const { formatValidateRequired } = require('./formatter.validate-required');

describe('formatValidateRequired', () => {
  test('shows success message when valid', () => {
    const result = { valid: true, missing: [], empty: [] };
    const output = formatValidateRequired(result, { color: false });
    expect(output).toContain('All required keys are present');
  });

  test('lists missing keys', () => {
    const result = { valid: false, missing: ['SECRET', 'TOKEN'], empty: [] };
    const output = formatValidateRequired(result, { color: false });
    expect(output).toContain('Missing required keys');
    expect(output).toContain('SECRET');
    expect(output).toContain('TOKEN');
  });

  test('lists empty keys', () => {
    const result = { valid: false, missing: [], empty: ['DB_PASS'] };
    const output = formatValidateRequired(result, { color: false });
    expect(output).toContain('Empty required keys');
    expect(output).toContain('DB_PASS');
  });

  test('lists both missing and empty keys', () => {
    const result = { valid: false, missing: ['API_KEY'], empty: ['DB_PASS'] };
    const output = formatValidateRequired(result, { color: false });
    expect(output).toContain('Missing required keys');
    expect(output).toContain('API_KEY');
    expect(output).toContain('Empty required keys');
    expect(output).toContain('DB_PASS');
  });

  test('does not throw with color enabled', () => {
    const result = { valid: false, missing: ['X'], empty: [] };
    expect(() => formatValidateRequired(result, { color: true })).not.toThrow();
  });
});
