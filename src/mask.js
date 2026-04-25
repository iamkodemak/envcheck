/**
 * mask.js — mask sensitive values in env objects
 *
 * Replaces the characters of a value with asterisks, optionally
 * revealing a configurable number of trailing characters.
 */

'use strict';

/**
 * Mask a single string value.
 * @param {string} value
 * @param {object} opts
 * @param {number} [opts.reveal=0]  number of trailing chars to keep visible
 * @param {string} [opts.char='*'] masking character
 * @returns {string}
 */
function maskValue(value, { reveal = 0, char = '*' } = {}) {
  if (typeof value !== 'string') return value;
  if (value.length === 0) return value;

  const visibleCount = Math.min(reveal, value.length);
  const maskedCount = value.length - visibleCount;
  return char.repeat(maskedCount) + value.slice(value.length - visibleCount);
}

/**
 * Mask values in a parsed env object.
 *
 * @param {Record<string, string>} env   parsed env key/value map
 * @param {string[]}               keys  list of keys whose values should be masked
 * @param {object}                 opts
 * @param {number} [opts.reveal=0]
 * @param {string} [opts.char='*']
 * @returns {Record<string, string>}
 */
function mask(env, keys = [], opts = {}) {
  if (!env || typeof env !== 'object') throw new TypeError('env must be an object');

  const keySet = new Set(keys);
  const result = {};

  for (const [k, v] of Object.entries(env)) {
    result[k] = keySet.has(k) ? maskValue(v, opts) : v;
  }

  return result;
}

module.exports = { mask, maskValue };
