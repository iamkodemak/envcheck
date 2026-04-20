const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { sort } = require('./sort');

function readEnvFile(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(abs, 'utf8');
}

function serializeEnv(env) {
  return Object.entries(env)
    .map(([k, v]) => (v === '' ? k : `${k}=${v}`))
    .join('\n') + '\n';
}

function runSort(filePath, options = {}) {
  const { groupByPrefix = false, write = false, output } = options;

  let raw;
  try {
    raw = readEnvFile(filePath);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const env = parse(raw);
  const { sorted, groups } = sort(env, { groupByPrefix });

  if (groupByPrefix && groups) {
    const sections = Object.keys(groups)
      .sort()
      .map((prefix) => {
        const header = prefix === '__UNGROUPED__' ? '# General' : `# ${prefix}`;
        const lines = Object.entries(groups[prefix])
          .map(([k, v]) => (v === '' ? k : `${k}=${v}`))
          .join('\n');
        return `${header}\n${lines}`;
      });
    const result = sections.join('\n\n') + '\n';

    if (write) {
      const dest = output || filePath;
      fs.writeFileSync(path.resolve(dest), result, 'utf8');
      console.log(`Sorted and written to ${dest}`);
    } else {
      process.stdout.write(result);
    }
    return;
  }

  const result = serializeEnv(sorted);

  if (write) {
    const dest = output || filePath;
    fs.writeFileSync(path.resolve(dest), result, 'utf8');
    console.log(`Sorted and written to ${dest}`);
  } else {
    process.stdout.write(result);
  }
}

module.exports = { readEnvFile, serializeEnv, runSort };
