const { report } = require('./reporter');

describe('report', () => {
  it('returns a summary string with counts', () => {
    const diffResult = { added: ['A'], removed: ['B', 'C'], changed: [] };
    const result = report(diffResult);
    expect(result).toContain('1');
    expect(result).toContain('2');
  });

  it('returns a clean summary when there are no differences', () => {
    const diffResult = { added: [], removed: [], changed: [] };
    const result = report(diffResult);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes changed count in output', () => {
    const diffResult = { added: [], removed: [], changed: ['X', 'Y'] };
    const result = report(diffResult);
    expect(result).toContain('2');
  });

  it('returns a string type always', () => {
    const result = report({ added: ['K'], removed: [], changed: ['M'] });
    expect(typeof result).toBe('string');
  });
});
