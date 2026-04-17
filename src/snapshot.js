const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');

const DEFAULT_SNAPSHOT_DIR = '.envcheck-snapshots';

function getSnapshotPath(label, dir = DEFAULT_SNAPSHOT_DIR) {
  return path.join(dir, `${label}.json`);
}

function saveSnapshot(label, envContent, dir = DEFAULT_SNAPSHOT_DIR) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const parsed = parse(envContent);
  const snapshot = {
    label,
    createdAt: new Date().toISOString(),
    keys: parsed,
  };
  fs.writeFileSync(getSnapshotPath(label, dir), JSON.stringify(snapshot, null, 2));
  return snapshot;
}

function loadSnapshot(label, dir = DEFAULT_SNAPSHOT_DIR) {
  const filePath = getSnapshotPath(label, dir);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Snapshot "${label}" not found at ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function listSnapshots(dir = DEFAULT_SNAPSHOT_DIR) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteSnapshot(label, dir = DEFAULT_SNAPSHOT_DIR) {
  const filePath = getSnapshotPath(label, dir);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Snapshot "${label}" not found.`);
  }
  fs.unlinkSync(filePath);
}

module.exports = { saveSnapshot, loadSnapshot, listSnapshots, deleteSnapshot };
