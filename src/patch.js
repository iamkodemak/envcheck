/**
 * patch.js — apply a set of key-value overrides to a parsed env object
 *
 * Supports three operations per key:
 *   set   – add or overwrite a key
 *   unset – remove a key
 *   rename – rename a key (preserving value)
 */

/**
 * @typedef {{ op: 'set'|'unset'|'rename', key: string, value?: string, newKey?: string }} PatchOp
 */

/**
 * Apply an array of patch operations to an env record.
 *
 * @param {Record<string, string>} env
 * @param {PatchOp[]} ops
 * @returns {{ result: Record<string, string>, applied: PatchOp[], skipped: PatchOp[] }}
 */
function patch(env, ops) {
  if (!Array.isArray(ops)) throw new TypeError('ops must be an array');

  const result = { ...env };
  const applied = [];
  const skipped = [];

  for (const op of ops) {
    if (!op || typeof op.op !== 'string' || typeof op.key !== 'string') {
      skipped.push(op);
      continue;
    }

    if (op.op === 'set') {
      if (typeof op.value === 'undefined') { skipped.push(op); continue; }
      result[op.key] = op.value;
      applied.push(op);
    } else if (op.op === 'unset') {
      if (!(op.key in result)) { skipped.push(op); continue; }
      delete result[op.key];
      applied.push(op);
    } else if (op.op === 'rename') {
      if (typeof op.newKey !== 'string' || !(op.key in result)) { skipped.push(op); continue; }
      result[op.newKey] = result[op.key];
      delete result[op.key];
      applied.push(op);
    } else {
      skipped.push(op);
    }
  }

  return { result, applied, skipped };
}

module.exports = { patch };
