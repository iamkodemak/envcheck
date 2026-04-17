const fs = require('fs');
const os = require('os');
const path = require('path');
const { saveSnapshot } = require('./snapshot');
const { diffAgainstSnapshot, diffSnapshots } = require('./snapshotDiff');

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'envcheck-snap-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('diffAgainstSnapshot', () => {
  test('detects added keys in live env', () => {
    saveSnapshot('base', 'FOO=1', tmpDir);
    const result = diffAgainstSnapshot('base', { FOO: '1', BAR: '2' }, tmpDir);
    expect(result.added).toContain('BAR');
    expect(result.missing).toHaveLength(0);
  });

  test('detects missing keys in live env', () => {
    saveSnapshot('base2', 'FOO=1\nBAR=2', tmpDir);
    const result = diffAgainstSnapshot('base2', { FOO: '1' }, tmpDir);
    expect(result.missing).toContain('BAR');
  });

  test('detects changed values', () => {
    saveSnapshot('base3', 'FOO=old', tmpDir);
    const result = diffAgainstSnapshot('base3', { FOO: 'new' }, tmpDir);
    expect(result.changed).toContainEqual(expect.objectContaining({ key: 'FOO' }));
  });
});

describe('diffSnapshots', () => {
  test('returns from/to labels and dates', () => {
    saveSnapshot('v1', 'A=1', tmpDir);
    saveSnapshot('v2', 'A=1\nB=2', tmpDir);
    const result = diffSnapshots('v1', 'v2', tmpDir);
    expect(result.from).toBe('v1');
    expect(result.to).toBe('v2');
    expect(result.fromDate).toBeDefined();
    expect(result.toDate).toBeDefined();
  });

  test('result contains diff between two snapshots', () => {
    saveSnapshot('s1', 'X=1', tmpDir);
    saveSnapshot('s2', 'X=1\nY=2', tmpDir);
    const { result } = diffSnapshots('s1', 's2', tmpDir);
    expect(result.added).toContain('Y');
  });
});
