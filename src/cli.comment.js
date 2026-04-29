/**
 * cli.comment.js — CLI handler for the comment command
 */
const fs = require('fs');
const { parse } = require('./parser');
const { stripComments, extractComments, countComments } = require('./comment');

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return parse(fs.readFileSync(filePath, 'utf8'));
}

function serializeEnv(entries) {
  return entries
    .map(e => (e.key ? `${e.key}=${e.value}` : ''))
    .filter(line => line !== '')
    .join('\n') + '\n';
}

/**
 * @param {object} argv
 * @param {string} argv.file
 * @param {'strip'|'extract'|'count'} argv.action
 * @param {boolean} [argv.inline]
 * @param {boolean} [argv.inPlace]
 * @param {object} io
 */
function runComment(argv, io = {}) {
  const out = io.stdout || process.stdout;
  const err = io.stderr || process.stderr;

  let entries;
  try {
    entries = readEnvFile(argv.file);
  } catch (e) {
    err.write(`error: ${e.message}\n`);
    return 1;
  }

  const action = argv.action || 'strip';

  if (action === 'count') {
    const n = countComments(entries);
    out.write(`${n} comment(s) found in ${argv.file}\n`);
    return 0;
  }

  if (action === 'extract') {
    const comments = extractComments(entries);
    if (comments.length === 0) {
      out.write('No comments found.\n');
    } else {
      comments.forEach(c => {
        const prefix = c.key ? `[line ${c.line}] (${c.key}) ` : `[line ${c.line}] `;
        out.write(`${prefix}${c.comment}\n`);
      });
    }
    return 0;
  }

  // default: strip
  const stripped = stripComments(entries, { inline: argv.inline !== false });
  const output = serializeEnv(stripped);

  if (argv.inPlace) {
    fs.writeFileSync(argv.file, output, 'utf8');
    out.write(`Stripped comments from ${argv.file}\n`);
  } else {
    out.write(output);
  }

  return 0;
}

module.exports = { readEnvFile, serializeEnv, runComment };
