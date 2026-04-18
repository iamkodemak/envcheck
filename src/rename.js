/**
 * rename: bulk rename keys in a parsed env object
 */

/**
 * Rename keys in an env object according to a map.
 * @param {Record<string,string>} env - parsed env key/value pairs
 * @param {Record<string,string>} renameMap - { oldKey: newKey }
 * @returns {{ result: Record<string,string>, renamed: {from:string,to:string}[], notFound: string[] }}
 */
function rename(env, renameMap) {
  const result = { ...env };
  const renamed = [];
  const notFound = [];

  for (const [oldKey, newKey] of Object.entries(renameMap)) {
    if (Object.prototype.hasOwnProperty.call(result, oldKey)) {
      result[newKey] = result[oldKey];
      delete result[oldKey];
      renamed.push({ from: oldKey, to: newKey });
    } else {
      notFound.push(oldKey);
    }
  }

  return { result, renamed, notFound };
}

module.exports = { rename };
