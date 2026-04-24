/**
 * cli.completion.js — CLI handler for the `completion` subcommand
 */

const fs = require('fs');
const path = require('path');
const { generateCompletion } = require('./completion');

const SUPPORTED_SHELLS = ['bash', 'zsh', 'fish'];

function detectShell() {
  const shell = process.env.SHELL || '';
  const base = path.basename(shell);
  if (SUPPORTED_SHELLS.includes(base)) return base;
  return null;
}

function runCompletion(argv, { stdout = process.stdout, stderr = process.stderr } = {}) {
  let shell = argv._[1];

  if (!shell) {
    shell = detectShell();
    if (!shell) {
      stderr.write(
        'error: could not detect shell. Specify one: envcheck completion <bash|zsh|fish>\n'
      );
      return 1;
    }
  }

  if (!SUPPORTED_SHELLS.includes(shell)) {
    stderr.write(
      `error: unsupported shell "${shell}". Supported: ${SUPPORTED_SHELLS.join(', ')}\n`
    );
    return 1;
  }

  let script;
  try {
    script = generateCompletion(shell);
  } catch (err) {
    stderr.write(`error: ${err.message}\n`);
    return 1;
  }

  if (argv.output) {
    const dest = path.resolve(argv.output);
    try {
      fs.writeFileSync(dest, script + '\n', 'utf8');
      stdout.write(`completion script written to ${dest}\n`);
    } catch (err) {
      stderr.write(`error: could not write file: ${err.message}\n`);
      return 1;
    }
  } else {
    stdout.write(script + '\n');
    if (!argv.silent) {
      stderr.write(
        `# To enable, add the following to your shell config:\n` +
        `#   source <(envcheck completion ${shell})\n`
      );
    }
  }

  return 0;
}

module.exports = { runCompletion };
