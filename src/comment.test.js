const { stripComments, extractComments, countComments } = require('./comment');

const sampleEntries = [
  { comment: '# App config' },
  { key: 'APP_NAME', value: 'myapp' },
  { key: 'PORT', value: '3000', comment: '# HTTP port' },
  { comment: '# Database' },
  { key: 'DB_HOST', value: 'localhost' },
  { key: 'DB_PORT', value: '5432' },
];

describe('stripComments', () => {
  it('removes standalone comment lines', () => {
    const result = stripComments(sampleEntries);
    expect(result.every(e => !(!e.key && e.comment))).toBe(true);
  });

  it('removes inline comments when inline=true (default)', () => {
    const result = stripComments(sampleEntries);
    const portEntry = result.find(e => e.key === 'PORT');
    expect(portEntry).toBeDefined();
    expect(portEntry.comment).toBeUndefined();
  });

  it('preserves inline comments when inline=false', () => {
    const result = stripComments(sampleEntries, { inline: false });
    const portEntry = result.find(e => e.key === 'PORT');
    expect(portEntry.comment).toBe('# HTTP port');
  });

  it('preserves all key/value entries', () => {
    const result = stripComments(sampleEntries);
    const keys = result.map(e => e.key).filter(Boolean);
    expect(keys).toEqual(['APP_NAME', 'PORT', 'DB_HOST', 'DB_PORT']);
  });
});

describe('extractComments', () => {
  it('extracts standalone comment lines with line numbers', () => {
    const result = extractComments(sampleEntries);
    const standalone = result.filter(r => !r.key);
    expect(standalone.length).toBe(2);
    expect(standalone[0].comment).toBe('# App config');
    expect(standalone[0].line).toBe(1);
  });

  it('extracts inline comments with associated key', () => {
    const result = extractComments(sampleEntries);
    const inline = result.filter(r => r.key);
    expect(inline.length).toBe(1);
    expect(inline[0].key).toBe('PORT');
    expect(inline[0].comment).toBe('# HTTP port');
  });

  it('returns empty array for entries with no comments', () => {
    const plain = [{ key: 'A', value: '1' }, { key: 'B', value: '2' }];
    expect(extractComments(plain)).toEqual([]);
  });
});

describe('countComments', () => {
  it('counts all entries with a comment field', () => {
    expect(countComments(sampleEntries)).toBe(3);
  });

  it('returns 0 for entries without comments', () => {
    const plain = [{ key: 'A', value: '1' }];
    expect(countComments(plain)).toBe(0);
  });
});
