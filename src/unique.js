/**
 * unique.js — filter env entries to only unique keys or values
 */

/**
 * Returns entries where each key appears only once (first occurrence wins).
 * Optionally, deduplicate by value instead.
 *
 * @param {Array<{key: string, value: string, comment?: string}>} entries
 * @param {object} options
 * @param {boolean} [options.byValue=false] - deduplicate by value instead of key
 * @returns {{ unique: Array, duplicates: Array }}
 */
function unique(entries, options = {}) {
  const { byValue = false } = options;
  const seen = new Map();
  const uniqueEntries = [];
  const duplicates = [];

  for (const entry of entries) {
    const discriminator = byValue ? entry.value : entry.key;

    if (seen.has(discriminator)) {
      duplicates.push({ ...entry, firstSeenKey: seen.get(discriminator) });
    } else {
      seen.set(discriminator, entry.key);
      uniqueEntries.push(entry);
    }
  }

  return { unique: uniqueEntries, duplicates };
}

module.exports = { unique };
