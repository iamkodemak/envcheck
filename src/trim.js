/**
 * trim.js — strip leading/trailing whitespace from .env values
 *
 * Supports:
 *  - trimming all values
 *  - trimming only keys matching a pattern
 *  - reporting which entries were changed
 */

/**
 * @typedef {{ key: string, value: string, comment?: string }} EnvEntry
 * @typedef {{ key: string, original: string, trimmed: string }} TrimChange
 * @typedef {{ entries: EnvEntry[], changes: TrimChange[] }} TrimResult
 */

/**
 * Trim whitespace from env entry values.
 *
 * @param {EnvEntry[]} entries
 * @param {{ keys?: string[] }} [options]
 * @returns {TrimResult}
 */
function trim(entries, options = {}) {
  const { keys } = options;
  const changes = [];

  const trimmed = entries.map((entry) => {
    if (entry.value === undefined || entry.value === null) return entry;

    const shouldTrim = !keys || keys.includes(entry.key);
    if (!shouldTrim) return entry;

    const original = entry.value;
    const trimmedValue = original.trim();

    if (original !== trimmedValue) {
      changes.push({ key: entry.key, original, trimmed: trimmedValue });
      return { ...entry, value: trimmedValue };
    }

    return entry;
  });

  return { entries: trimmed, changes };
}

module.exports = { trim };
