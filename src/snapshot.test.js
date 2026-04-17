const fs = require('fs');
const os = require('os');
const path = require('path');
const { saveSnapshot, loadSnapshot, listSnapshots, deleteSnapshot } = require('./snapshot');

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'envcheck-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('saveSnapshot', () => {
  test('creates snapshot file with parsed keys', () => {
    const snap = saveSnapshot('test', 'FOO=bar\nBAZ=qux', tmpDir);
    expect(snap.label).toBe('test');
    expect(snap.keys).toEqual({ FOO: 'bar', BAZ: 'qux' });
    expect(fs.existsSync(path.join(tmpDir, 'test.json'))).toBe(true);
  });

  test('snapshot includes createdAt timestamp', () => {
    const snap = saveSnapshot('ts-test', 'A=1', tmpDir);
    expect(snap.createdAt).toBeDefined();
    expect(new Date(snap.createdAt).toString()).not.toBe('Invalid Date');
  });
});

describe('loadSnapshot', () => {
  test('loads a previously saved snapshot', () => {
    saveSnapshot('load-test', 'X=1\nY=2', tmpDir);
    const snap = loadSnapshot('load-test', tmpDir);
    expect(snap.keys).toEqual({ X: '1', Y: '2' });
  });

  test('throws if snapshot does not exist', () => {
    expect(() => loadSnapshot('missing', tmpDir)).toThrow(/not found/);
  });
});

describe('listSnapshots', () => {
  test('returns empty array when no snapshots', () => {
    expect(listSnapshots(tmpDir)).toEqual([]);
  });

  test('returns list of snapshot labels', () => {
    saveSnapshot('alpha', 'A=1', tmpDir);
    saveSnapshot('beta', 'B=2', tmpDir);
    const list = listSnapshots(tmpDir);
    expect(list.sort()).toEqual(['alpha', 'beta']);
  });
});

describe('deleteSnapshot', () => {
  test('removes snapshot file', () => {
    saveSnapshot('to-delete', 'Z=9', tmpDir);
    deleteSnapshot('to-delete', tmpDir);
    expect(listSnapshots(tmpDir)).toEqual([]);
  });

  test('throws if snapshot does not exist', () => {
    expect(() => deleteSnapshot('ghost', tmpDir)).toThrow(/not found/);
  });
});
