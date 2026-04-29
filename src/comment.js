/**
 * comment.js — strip or preserve comments in .env files
 */

/**
 * Strip all comment lines and inline comments from parsed env entries.
 * @param {Array<{key: string, value: string, comment?: string}>} entries
 * @param {object} options
 * @param {boolean} [options.inline=true] - strip inline comments
 * @returns {Array<{key: string, value: string}>}
 */
function stripComments(entries, options = {}) {
  const { inline = true } = options;
  return entries
    .filter(entry => !entry.comment || entry.key)
    .map(entry => {
      if (inline && entry.comment) {
        const { comment, ...rest } = entry;
        return rest;
      }
      return entry;
    });
}

/**
 * Extract only comment lines from parsed env entries.
 * @param {Array<{key?: string, value?: string, comment?: string}>} entries
 * @returns {Array<{line: number, comment: string}>}
 */
function extractComments(entries) {
  const results = [];
  entries.forEach((entry, index) => {
    if (entry.comment && !entry.key) {
      results.push({ line: index + 1, comment: entry.comment });
    } else if (entry.comment && entry.key) {
      results.push({ line: index + 1, key: entry.key, comment: entry.comment });
    }
  });
  return results;
}

/**
 * Count comment lines in parsed entries.
 * @param {Array} entries
 * @returns {number}
 */
function countComments(entries) {
  return entries.filter(e => e.comment).length;
}

module.exports = { stripComments, extractComments, countComments };
