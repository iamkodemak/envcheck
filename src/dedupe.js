/**
 * dedupe.js — remove duplicate keys from a parsed env object,
 * keeping either the first or last occurrence.
 */

/**
 * @param {Array<{key: string, value: string, comment?: string}>} entries
 * @param {{ strategy?: 'first' | 'last' }} options
 * @returns {{ entries: Array, duplicates: Array<{key: string, kept: string, dropped: string[]}> }}
 */
function dedupe(entries, options = {}) {
  const strategy = options.strategy || 'last';

  const seen = new Map(); // key -> array of indices

  entries.forEach((entry, idx) => {
    if (!entry.key) return;
    if (!seen.has(entry.key)) {
      seen.set(entry.key, []);
    }
    seen.get(entry.key).push(idx);
  });

  const duplicates = [];
  const dropIndices = new Set();

  for (const [key, indices] of seen.entries()) {
    if (indices.length < 2) continue;

    const keepIdx = strategy === 'first' ? indices[0] : indices[indices.length - 1];
    const dropIdxs = indices.filter((i) => i !== keepIdx);

    dropIdxs.forEach((i) => dropIndices.add(i));

    duplicates.push({
      key,
      kept: entries[keepIdx].value,
      dropped: dropIdxs.map((i) => entries[i].value),
    });
  }

  const deduped = entries.filter((_, idx) => !dropIndices.has(idx));

  return { entries: deduped, duplicates };
}

module.exports = { dedupe };
