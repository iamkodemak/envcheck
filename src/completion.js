/**
 * completion.js — generate shell completion scripts for envcheck CLI
 */

const COMMANDS = [
  'diff',
  'validate',
  'lint',
  'schema',
  'merge',
  'snapshot',
  'transform',
  'rename',
  'redact',
  'sort',
  'convert',
  'interpolate',
  'audit',
  'compare',
  'group',
  'extract',
  'flatten',
  'completion',
];

const FLAGS = [
  '--help',
  '--version',
  '--output',
  '--format',
  '--keys-only',
  '--no-color',
  '--silent',
  '--write',
  '--inplace',
];

function generateBash() {
  return `
_envcheck_completions() {
  local cur="\${COMP_WORDS[COMP_CWORD]}"
  local commands="${COMMANDS.join(' ')}"
  local flags="${FLAGS.join(' ')}"

  if [[ "\${cur}" == -* ]]; then
    COMPREPLY=( $(compgen -W "\${flags}" -- "\${cur}") )
  else
    COMPREPLY=( $(compgen -W "\${commands}" -- "\${cur}") )
  fi
}

complete -F _envcheck_completions envcheck
`.trim();
}

function generateZsh() {
  const cmds = COMMANDS.map(c => `    '${c}'`).join('\n');
  return `
#compdef envcheck

_envcheck() {
  local -a commands
  commands=(
${cmds}
  )

  local -a flags
  flags=(${FLAGS.map(f => `'${f}'`).join(' ')})

  _arguments \\
    '1: :->command' \\
    '*: :->args'

  case \$state in
    command) _describe 'command' commands ;;
    args) _files -g '*.env' ;;
  esac
}

_envcheck
`.trim();
}

function generateFish() {
  const cmds = COMMANDS.map(
    c => `complete -c envcheck -f -n '__fish_use_subcommand' -a '${c}'`
  ).join('\n');
  const flgs = FLAGS.map(
    f => `complete -c envcheck -l '${f.replace(/^-+/, '')}'`
  ).join('\n');
  return `${cmds}\n${flgs}`;
}

function generateCompletion(shell) {
  switch (shell) {
    case 'bash': return generateBash();
    case 'zsh':  return generateZsh();
    case 'fish': return generateFish();
    default:
      throw new Error(`Unsupported shell: ${shell}. Use bash, zsh, or fish.`);
  }
}

module.exports = { generateCompletion, COMMANDS, FLAGS };
