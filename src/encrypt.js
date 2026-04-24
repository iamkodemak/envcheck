/**
 * Encrypt/decrypt .env values using AES-256-GCM
 */
const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function deriveKey(secret) {
  return crypto.scryptSync(secret, 'envcheck-salt', KEY_LENGTH);
}

function encryptValue(value, secret) {
  const key = deriveKey(secret);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:${Buffer.concat([iv, tag, encrypted]).toString('base64')}`;
}

function decryptValue(value, secret) {
  if (!value.startsWith('enc:')) {
    throw new Error('Value is not encrypted');
  }
  const key = deriveKey(secret);
  const data = Buffer.from(value.slice(4), 'base64');
  const iv = data.subarray(0, IV_LENGTH);
  const tag = data.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = data.subarray(IV_LENGTH + TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(encrypted) + decipher.final('utf8');
}

function encrypt(parsed, secret, keys = null) {
  const result = {};
  for (const [k, v] of Object.entries(parsed)) {
    if (keys === null || keys.includes(k)) {
      result[k] = encryptValue(v, secret);
    } else {
      result[k] = v;
    }
  }
  return result;
}

function decrypt(parsed, secret, keys = null) {
  const result = {};
  for (const [k, v] of Object.entries(parsed)) {
    if ((keys === null || keys.includes(k)) && v.startsWith('enc:')) {
      result[k] = decryptValue(v, secret);
    } else {
      result[k] = v;
    }
  }
  return result;
}

module.exports = { encrypt, decrypt, encryptValue, decryptValue };
