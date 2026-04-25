import fs from 'fs';
import path from 'path';
import { parse } from './parser.js';
import { split } from './split.js';
import { formatSplit } from './formatter.split.js';

export function readEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return parse(content);
}

function serializeEnv(env) {
  return Object.entries(env)
    .map(([k, v]) => {
      const val = v.value !== undefined ? v.value : v;
      return `${k}=${val}`;
    })
    .join('\n') + '\n';
}

/**
 * runSplit — CLI handler for the `split` command.
 * @param {string} inputFile
 * @param {string[]} prefixes
 * @param {Object} opts
 */
export function runSplit(inputFile, prefixes, opts = {}) {
  if (!inputFile) {
    console.error('Error: input file is required');
    process.exit(1);
  }
  if (!prefixes || prefixes.length === 0) {
    console.error('Error: at least one prefix is required');
    process.exit(1);
  }

  const env = readEnvFile(inputFile);
  const groups = split(env, prefixes, { stripPrefix: opts.stripPrefix || false });

  if (opts.outDir) {
    fs.mkdirSync(opts.outDir, { recursive: true });
    for (const [group, groupEnv] of Object.entries(groups)) {
      const safeName = group.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+$/, '') || 'other';
      const outPath = path.join(opts.outDir, `.env.${safeName.toLowerCase()}`);
      fs.writeFileSync(outPath, serializeEnv(groupEnv));
      console.log(`Written: ${outPath} (${Object.keys(groupEnv).length} keys)`);
    }
  } else {
    console.log(formatSplit(groups, { color: opts.color !== false }));
  }
}
