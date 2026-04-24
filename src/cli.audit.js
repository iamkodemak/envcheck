/**
 * cli.audit.js — CLI handler for the `audit` command
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { audit } = require('./audit');

function readEnvFile(filePath) {
  const content = fs.readFileSync(path.resolve(filePath), 'utf8');
  return parse(content);
}

function formatAuditResults(findings, filePath) {
  if (findings.length === 0) {
    return `✔  No issues found in ${filePath}\n`;
  }

  const lines = [`⚠  Audit findings for ${filePath} (${findings.length} issue(s)):\n`];

  const riskIcon = {
    'sensitive-key': '🔑',
    'empty-value': '⬜',
    'plaintext-url-credentials': '🔗',
  };

  for (const finding of findings) {
    const icon = riskIcon[finding.risk] || '!';
    lines.push(`  ${icon}  [${finding.risk}] ${finding.message}`);
  }

  return lines.join('\n') + '\n';
}

function runAudit(argv, options = {}) {
  const out = options.out || process.stdout;
  const exitFn = options.exit || process.exit;

  const filePath = argv._[1];

  if (!filePath) {
    out.write('Usage: envcheck audit <file>\n');
    return exitFn(1);
  }

  let env;
  try {
    env = readEnvFile(filePath);
  } catch (err) {
    out.write(`Error reading file: ${err.message}\n`);
    return exitFn(1);
  }

  const findings = audit(env);
  out.write(formatAuditResults(findings, filePath));

  if (findings.length > 0) {
    return exitFn(1);
  }
}

module.exports = { readEnvFile, formatAuditResults, runAudit };
