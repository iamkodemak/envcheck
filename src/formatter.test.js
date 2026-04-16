const { formatDiff, formatValidation, colorize } = require('./formatter');

describe('colorize', () => {
  it('wraps text with color codes when useColor is true', () => {
    const result = colorize('hello', 'red', true);
    expect(result).toContain('hello');
    expect(result).toContain('\x1b[31m');
  });

  it('returns plain text when useColor is false', () => {
    const result = colorize('hello', 'red', false);
    expect(result).toBe('hello');
  });
});

describe('formatDiff', () => {
  const opts = { useColor: false };

  it('shows added keys', () => {
    const result = formatDiff({ added: ['API_KEY'], removed: [], changed: [] }, opts);
    expect(result).toContain('+ API_KEY');
    expect(result).toContain('Missing in target');
  });

  it('shows removed keys', () => {
    const result = formatDiff({ added: [], removed: ['OLD_KEY'], changed: [] }, opts);
    expect(result).toContain('- OLD_KEY');
    expect(result).toContain('Extra in target');
  });

  it('shows changed keys', () => {
    const result = formatDiff({ added: [], removed: [], changed: ['DB_URL'] }, opts);
    expect(result).toContain('~ DB_URL');
    expect(result).toContain('Changed keys');
  });

  it('shows no differences message when result is empty', () => {
    const result = formatDiff({ added: [], removed: [], changed: [] }, opts);
    expect(result).toContain('No differences found.');
  });
});

describe('formatValidation', () => {
  const opts = { useColor: false };

  it('shows errors', () => {
    const result = formatValidation({ errors: ['KEY is missing'], warnings: [] }, opts);
    expect(result).toContain('✖ KEY is missing');
    expect(result).toContain('Validation Errors');
  });

  it('shows warnings', () => {
    const result = formatValidation({ errors: [], warnings: ['KEY is empty'] }, opts);
    expect(result).toContain('⚠ KEY is empty');
    expect(result).toContain('Warnings');
  });

  it('shows success message when no issues', () => {
    const result = formatValidation({ errors: [], warnings: [] }, opts);
    expect(result).toContain('All validations passed.');
  });
});
