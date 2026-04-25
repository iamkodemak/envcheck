/**
 * cli.unique.js — CLI handler for the `unique` command
 */
const fs = require('fs');
const { parse } = require('./parser');
const { unique } = require('./unique');

function readEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return parse(content);
}

function serializeEnv(entries) {
  return entries
    .map(({ key, value, comment }) => {
      const line = `${key}=${value}`;
      return comment ? `${comment}\n${line}` : line;
    })
    .join('\n') + '\n';
}

/**
 * @param {string} filePath
 * @param {object} opts
 * @param {boolean} [opts.byValue]
 * @param {boolean} [opts.inPlace]
 * @param {boolean} [opts.verbose]
 * @param {object} out  - output stream (defaults to process.stdout)
 */
function runUnique(filePath, opts = {}, out = process.stdout) {
  const entries = readEnvFile(filePath);
  const { unique: uniqueEntries, duplicates } = unique(entries, {
    byValue: !!opts.byValue,
  });

  if (opts.verbose && duplicates.length > 0) {
    out.write(`Removed ${duplicates.length} duplicate(s):\n`);
    for (const d of duplicates) {
      out.write(
        `  ${d.key}=${d.value}  (duplicate of key "${d.firstSeenKey}")\n`
      );
    }
    out.write('\n');
  }

  const output = serializeEnv(uniqueEntries);

  if (opts.inPlace) {
    fs.writeFileSync(filePath, output, 'utf8');
    out.write(`Wrote ${uniqueEntries.length} unique entries to ${filePath}\n`);
  } else {
    out.write(output);
  }
}

module.exports = { readEnvFile, serializeEnv, runUnique };
