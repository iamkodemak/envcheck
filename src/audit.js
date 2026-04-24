/**
 * audit.js — detect potentially sensitive or risky keys in .env files
 */

const SENSITIVE_PATTERNS = [
  /password/i,
  /passwd/i,
  /secret/i,
  /token/i,
  /api[_-]?key/i,
  /private[_-]?key/i,
  /auth/i,
  /credential/i,
  /access[_-]?key/i,
  /signing/i,
  /encryption/i,
  /cert/i,
  /ssh/i,
];

const EMPTY_VALUE_RISK = 'empty-value';
const SENSITIVE_KEY_RISK = 'sensitive-key';
const PLAINTEXT_URL_WITH_CREDS_RISK = 'plaintext-url-credentials';

const URL_WITH_CREDS_RE = /https?:\/\/[^:@\s]+:[^@\s]+@/i;

/**
 * @param {Record<string, string>} env
 * @returns {Array<{key: string, risk: string, message: string}>}
 */
function audit(env) {
  const findings = [];

  for (const [key, value] of Object.entries(env)) {
    if (SENSITIVE_PATTERNS.some((re) => re.test(key))) {
      if (value === '' || value === undefined) {
        findings.push({
          key,
          risk: EMPTY_VALUE_RISK,
          message: `Sensitive key "${key}" has an empty value`,
        });
      } else {
        findings.push({
          key,
          risk: SENSITIVE_KEY_RISK,
          message: `Key "${key}" appears to contain sensitive data`,
        });
      }
    }

    if (typeof value === 'string' && URL_WITH_CREDS_RE.test(value)) {
      findings.push({
        key,
        risk: PLAINTEXT_URL_WITH_CREDS_RISK,
        message: `Key "${key}" contains a URL with embedded credentials`,
      });
    }
  }

  return findings;
}

module.exports = { audit, SENSITIVE_KEY_RISK, EMPTY_VALUE_RISK, PLAINTEXT_URL_WITH_CREDS_RISK };
