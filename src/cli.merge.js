const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { merge } = require('./merge');
const { colorize } = require('./formatter');

/**
 * Read and parse an env file, exit on error.
 */
function readEnvFile(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    console.error(colorize(`File not found: ${filePath}`, 'red'));
    process.exit(1);
  }
  const content = fs.readFileSync(abs, 'utf8');
  return parse(content);
}

/**
 * runMerge: merge N env files, print result and warn about conflicts.
 * Usage: envcheck merge file1 file2 [file3 ...] [--output out.env]
 */
function runMerge(args) {
  const outputIdx = args.indexOf('--output');
  let files = [...args];
  let outputPath = null;

  if (outputIdx !== -1) {
    outputPath = args[outputIdx + 1];
    files = args.filter((_, i) => i !== outputIdx && i !== outputIdx + 1);
  }

  if (files.length < 2) {
    console.error(colorize('merge requires at least 2 files', 'red'));
    process.exit(1);
  }

  const envObjects = files.map(readEnvFile);
  const { merged, conflicts } = merge(...envObjects);

  if (Object.keys(conflicts).length > 0) {
    console.warn(colorize('Conflicts detected (last file wins):', 'yellow'));
    for (const [key, values] of Object.entries(conflicts)) {
      console.warn(colorize(`  ${key}: ${values.join(' -> ')}`, 'yellow'));
    }
  }

  const lines = Object.entries(merged).map(([k, v]) => `${k}=${v}`);
  const output = lines.join('\n') + '\n';

  if (outputPath) {
    fs.writeFileSync(path.resolve(outputPath), output, 'utf8');
    console.log(colorize(`Merged env written to ${outputPath}`, 'green'));
  } else {
    process.stdout.write(output);
  }
}

module.exports = { runMerge };
