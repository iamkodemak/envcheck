const { loadSnapshot } = require('./snapshot');
const { diff } = require('./diff');

/**
 * Compare a live env content against a saved snapshot.
 * Returns a standard diff result.
 */
function diffAgainstSnapshot(label, liveEnvKeys, dir = undefined) {
  const snapshot = dir ? loadSnapshot(label, dir) : loadSnapshot(label);
  return diff(snapshot.keys, liveEnvKeys);
}

/**
 * Compare two saved snapshots by label.
 */
function diffSnapshots(labelA, labelB, dir = undefined) {
  const snapA = dir ? loadSnapshot(labelA, dir) : loadSnapshot(labelA);
  const snapB = dir ? loadSnapshot(labelB, dir) : loadSnapshot(labelB);
  return {
    from: labelA,
    to: labelB,
    fromDate: snapA.createdAt,
    toDate: snapB.createdAt,
    result: diff(snapA.keys, snapB.keys),
  };
}

module.exports = { diffAgainstSnapshot, diffSnapshots };
