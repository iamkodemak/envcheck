const { generateCompletion, COMMANDS, FLAGS } = require('./completion');

describe('generateCompletion', () => {
  test('COMMANDS includes core subcommands', () => {
    expect(COMMANDS).toContain('diff');
    expect(COMMANDS).toContain('validate');
    expect(COMMANDS).toContain('lint');
    expect(COMMANDS).toContain('completion');
  });

  test('FLAGS includes common flags', () => {
    expect(FLAGS).toContain('--help');
    expect(FLAGS).toContain('--output');
    expect(FLAGS).toContain('--no-color');
  });

  describe('bash', () => {
    let out;
    beforeEach(() => { out = generateCompletion('bash'); });

    test('defines completion function', () => {
      expect(out).toContain('_envcheck_completions');
    });

    test('registers complete command', () => {
      expect(out).toContain('complete -F _envcheck_completions envcheck');
    });

    test('includes all commands', () => {
      COMMANDS.forEach(cmd => expect(out).toContain(cmd));
    });

    test('includes flags', () => {
      expect(out).toContain('--help');
    });
  });

  describe('zsh', () => {
    let out;
    beforeEach(() => { out = generateCompletion('zsh'); });

    test('defines zsh compdef', () => {
      expect(out).toContain('#compdef envcheck');
    });

    test('includes _envcheck function', () => {
      expect(out).toContain('_envcheck()');
    });

    test('includes all commands', () => {
      COMMANDS.forEach(cmd => expect(out).toContain(cmd));
    });
  });

  describe('fish', () => {
    let out;
    beforeEach(() => { out = generateCompletion('fish'); });

    test('uses fish complete syntax', () => {
      expect(out).toContain('complete -c envcheck');
    });

    test('includes all commands', () => {
      COMMANDS.forEach(cmd => expect(out).toContain(cmd));
    });
  });

  test('throws on unsupported shell', () => {
    expect(() => generateCompletion('powershell')).toThrow('Unsupported shell');
  });
});
