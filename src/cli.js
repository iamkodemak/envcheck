#!/usr/bin/env node

/**
 * Main CLI entry point for envcheck.
 * Wires up all subcommands: diff, validate, snapshot, merge, lint, schema, transform, rename, redact, sort, convert.
 */

const { program } = require('commander');
const { readFileSync } = require('fs');
const { join } = require('path');

const { runDiff, runValidate } = require('./cli');
const { runSnapshotSave, runSnapshotList, runSnapshotDelete, runSnapshotDiffLive, runSnapshotDiffTwo } = require('./cli.snapshot');
const { runMerge } = require('./cli.merge');
const { runLint } = require('./cli.lint');
const { runSchemaValidate } = require('./cli.schema');
const { runTransform } = require('./cli.transform');
const { runRename } = require('./cli.rename');
const { runRedact } = require('./cli.redact');
const { runSort } = require('./cli.sort');
const { runConvert } = require('./cli.convert');

const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));

program
  .name('envcheck')
  .description('Validate and diff .env files across environments')
  .version(pkg.version);

// diff
program
  .command('diff <fileA> <fileB>')
  .description('Show differences between two .env files')
  .option('--no-color', 'Disable colored output')
  .action((fileA, fileB, opts) => runDiff(fileA, fileB, opts));

// validate
program
  .command('validate <file> [reference]')
  .description('Validate a .env file, optionally against a reference')
  .option('--no-color', 'Disable colored output')
  .action((file, reference, opts) => runValidate(file, reference, opts));

// snapshot
const snapshot = program.command('snapshot').description('Manage .env snapshots');

snapshot
  .command('save <file> <name>')
  .description('Save a snapshot of a .env file')
  .action((file, name) => runSnapshotSave(file, name));

snapshot
  .command('list')
  .description('List all saved snapshots')
  .action(() => runSnapshotList());

snapshot
  .command('delete <name>')
  .description('Delete a saved snapshot')
  .action((name) => runSnapshotDelete(name));

snapshot
  .command('diff <file> <name>')
  .description('Diff a live .env file against a snapshot')
  .option('--no-color', 'Disable colored output')
  .action((file, name, opts) => runSnapshotDiffLive(file, name, opts));

snapshot
  .command('diff2 <nameA> <nameB>')
  .description('Diff two snapshots against each other')
  .option('--no-color', 'Disable colored output')
  .action((nameA, nameB, opts) => runSnapshotDiffTwo(nameA, nameB, opts));

// merge
program
  .command('merge <base> <override> <output>')
  .description('Merge two .env files, writing result to output')
  .option('--no-color', 'Disable colored output')
  .action((base, override, output, opts) => runMerge(base, override, output, opts));

// lint
program
  .command('lint <file>')
  .description('Lint a .env file for common issues')
  .option('--no-color', 'Disable colored output')
  .action((file, opts) => runLint(file, opts));

// schema
program
  .command('schema <file> <schema>')
  .description('Validate a .env file against a JSON schema')
  .option('--no-color', 'Disable colored output')
  .action((file, schema, opts) => runSchemaValidate(file, schema, opts));

// transform
program
  .command('transform <file>')
  .description('Apply key/value transformations to a .env file')
  .option('--prefix <prefix>', 'Add a prefix to all keys')
  .option('--suffix <suffix>', 'Add a suffix to all keys')
  .option('--uppercase', 'Convert all keys to uppercase')
  .option('--lowercase', 'Convert all keys to lowercase')
  .option('--no-color', 'Disable colored output')
  .action((file, opts) => runTransform(file, opts));

// rename
program
  .command('rename <file> <from> <to>')
  .description('Rename a key in a .env file')
  .option('--in-place', 'Overwrite the source file')
  .action((file, from, to, opts) => runRename(file, from, to, opts));

// redact
program
  .command('redact <file>')
  .description('Redact sensitive values in a .env file')
  .option('--keys <keys>', 'Comma-separated list of keys to redact')
  .option('--in-place', 'Overwrite the source file')
  .action((file, opts) => runRedact(file, opts));

// sort
program
  .command('sort <file>')
  .description('Sort keys in a .env file alphabetically')
  .option('--in-place', 'Overwrite the source file')
  .option('--desc', 'Sort in descending order')
  .action((file, opts) => runSort(file, opts));

// convert
program
  .command('convert <file>')
  .description('Convert a .env file to another format (json, yaml, export)')
  .option('--format <format>', 'Output format: json, yaml, export', 'json')
  .option('--output <output>', 'Write output to a file instead of stdout')
  .action((file, opts) => runConvert(file, opts));

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
