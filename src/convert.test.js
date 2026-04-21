const { convert } = require('./convert');

describe('convert', () => {
  const parsed = {
    APP_NAME: 'myapp',
    DEBUG: 'true',
    PORT: '3000',
    EMPTY: '',
    MESSAGE: 'hello world',
    SECRET: "it's a secret",
  };

  describe('json', () => {
    it('outputs valid JSON', () => {
      const result = convert(parsed, 'json');
      expect(() => JSON.parse(result)).not.toThrow();
      expect(JSON.parse(result)).toEqual(parsed);
    });

    it('is pretty printed', () => {
      const result = convert(parsed, 'json');
      expect(result).toContain('\n');
    });
  });

  describe('yaml', () => {
    it('outputs key: value pairs', () => {
      const result = convert({ PORT: '3000' }, 'yaml');
      expect(result).toBe('PORT: 3000');
    });

    it('quotes empty values', () => {
      const result = convert({ EMPTY: '' }, 'yaml');
      expect(result).toBe('EMPTY: ""');
    });

    it('quotes boolean-like values', () => {
      const result = convert({ DEBUG: 'true' }, 'yaml');
      expect(result).toBe('DEBUG: "true"');
    });

    it('quotes values with special characters', () => {
      const result = convert({ URL: 'http://x.com:8080' }, 'yaml');
      expect(result).toContain('"');
    });
  });

  describe('export', () => {
    it('outputs export statements', () => {
      const result = convert({ PORT: '3000' }, 'export');
      expect(result).toBe("export PORT='3000'");
    });

    it('handles single quotes in values', () => {
      const result = convert({ SECRET: "it's" }, 'export');
      expect(result).toContain("SECRET=");
      expect(result).not.toMatch(/export SECRET='it's'/);
    });

    it('handles multiple keys', () => {
      const result = convert({ A: '1', B: '2' }, 'export');
      const lines = result.split('\n');
      expect(lines).toHaveLength(2);
    });
  });

  describe('unknown format', () => {
    it('throws an error', () => {
      expect(() => convert(parsed, 'toml')).toThrow('Unsupported format');
    });
  });
});
