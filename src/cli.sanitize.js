const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { sanitize } = require('./sanitize');
const { formatSanitize } = require('./formatter.sanitize');

function readEnvFile(filePath) {
  const content = fs.readFileSync(path.resolve(filePath), 'utf8');
  return parse(content);
}

function serializeEnv(env) {
  return Object.entries(env)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n') + '\n';
}

/**
 * @param {object} argv  yargs-parsed args
 * @param {string} argv.file
 * @param {boolean} [argv.trim]
 * @param {boolean} [argv.stripControl]
 * @param {string[]} [argv.rule]   e.g. ["^Bearer ,""] — pattern,replacement pairs
 * @param {string}  [argv.output]  write result to file instead of stdout
 * @param {boolean} [argv.noColor]
 */
function runSanitize(argv) {
  const env = readEnvFile(argv.file);

  const rules = [];
  if (argv.rule) {
    const rawRules = Array.isArray(argv.rule) ? argv.rule : [argv.rule];
    for (const r of rawRules) {
      const sep = r.indexOf(',');
      if (sep === -1) {
        rules.push({ pattern: r, replacement: '' });
      } else {
        rules.push({
          pattern: r.slice(0, sep),
          replacement: r.slice(sep + 1)
        });
      }
    }
  }

  const { result, changes } = sanitize(env, {
    trimValues: !!argv.trim,
    stripControl: !!argv['strip-control'],
    rules
  });

  if (argv.output) {
    fs.writeFileSync(path.resolve(argv.output), serializeEnv(result), 'utf8');
    console.log(formatSanitize(changes, { noColor: argv.noColor }));
  } else if (changes.length > 0) {
    console.log(formatSanitize(changes, { noColor: argv.noColor }));
    process.exitCode = 0;
  } else {
    console.log(formatSanitize([], { noColor: argv.noColor }));
  }
}

module.exports = { readEnvFile, serializeEnv, runSanitize };
