const { readEnvFile } = require('./cli');
const { saveSnapshot, loadSnapshot, listSnapshots, deleteSnapshot } = require('./snapshot');
const { diffAgainstSnapshot, diffSnapshots } = require('./snapshotDiff');
const { formatDiff } = require('./formatter');
const { parse } = require('./parser');

function runSnapshotSave(label, envPath) {
  const content = readEnvFile(envPath);
  const snap = saveSnapshot(label, content);
  console.log(`Snapshot "${snap.label}" saved at ${snap.createdAt}`);
}

function runSnapshotList() {
  const labels = listSnapshots();
  if (labels.length === 0) {
    console.log('No snapshots found.');
  } else {
    console.log('Saved snapshots:');
    labels.forEach(l => console.log(`  - ${l}`));
  }
}

function runSnapshotDelete(label) {
  deleteSnapshot(label);
  console.log(`Snapshot "${label}" deleted.`);
}

function runSnapshotDiffLive(label, envPath) {
  const content = readEnvFile(envPath);
  const liveKeys = parse(content);
  const result = diffAgainstSnapshot(label, liveKeys);
  console.log(formatDiff(result));
  if (result.missing.length || result.added.length || result.changed.length) {
    process.exit(1);
  }
}

function runSnapshotDiffTwo(labelA, labelB) {
  const { from, to, fromDate, toDate, result } = diffSnapshots(labelA, labelB);
  console.log(`Comparing "${from}" (${fromDate}) → "${to}" (${toDate})`);
  console.log(formatDiff(result));
  if (result.missing.length || result.added.length || result.changed.length) {
    process.exit(1);
  }
}

module.exports = { runSnapshotSave, runSnapshotList, runSnapshotDelete, runSnapshotDiffLive, runSnapshotDiffTwo };
