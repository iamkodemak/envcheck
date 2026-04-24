const { audit, SENSITIVE_KEY_RISK, EMPTY_VALUE_RISK, PLAINTEXT_URL_WITH_CREDS_RISK } = require('./audit');

describe('audit', () => {
  it('flags keys matching sensitive patterns', () => {
    const env = { API_KEY: 'abc123', DB_HOST: 'localhost' };
    const findings = audit(env);
    expect(findings).toHaveLength(1);
    expect(findings[0].key).toBe('API_KEY');
    expect(findings[0].risk).toBe(SENSITIVE_KEY_RISK);
  });

  it('flags empty sensitive keys separately', () => {
    const env = { DB_PASSWORD: '' };
    const findings = audit(env);
    expect(findings).toHaveLength(1);
    expect(findings[0].risk).toBe(EMPTY_VALUE_RISK);
    expect(findings[0].message).toMatch(/empty value/);
  });

  it('flags URLs with embedded credentials', () => {
    const env = { DATABASE_URL: 'postgres://user:pass@localhost:5432/db' };
    const findings = audit(env);
    const urlFinding = findings.find((f) => f.risk === PLAINTEXT_URL_WITH_CREDS_RISK);
    expect(urlFinding).toBeDefined();
    expect(urlFinding.key).toBe('DATABASE_URL');
  });

  it('returns no findings for safe env', () => {
    const env = { NODE_ENV: 'production', PORT: '3000', LOG_LEVEL: 'info' };
    const findings = audit(env);
    expect(findings).toHaveLength(0);
  });

  it('handles multiple sensitive keys', () => {
    const env = { JWT_SECRET: 'mysecret', ACCESS_TOKEN: 'tok', APP_NAME: 'envcheck' };
    const findings = audit(env);
    expect(findings).toHaveLength(2);
    expect(findings.map((f) => f.key)).toEqual(expect.arrayContaining(['JWT_SECRET', 'ACCESS_TOKEN']));
  });

  it('is case-insensitive for key matching', () => {
    const env = { db_password: 'secret', Api_Key: 'key123' };
    const findings = audit(env);
    expect(findings.map((f) => f.key)).toEqual(expect.arrayContaining(['db_password', 'Api_Key']));
  });

  it('can flag both sensitive key and url credentials on same key', () => {
    const env = { AUTH_URL: 'https://admin:pass@auth.example.com' };
    const findings = audit(env);
    expect(findings.length).toBeGreaterThanOrEqual(2);
    const risks = findings.map((f) => f.risk);
    expect(risks).toContain(SENSITIVE_KEY_RISK);
    expect(risks).toContain(PLAINTEXT_URL_WITH_CREDS_RISK);
  });
});
