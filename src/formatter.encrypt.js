const { colorize } = require('./formatter');

function formatEncrypt(result, mode = 'encrypt') {
  const lines = [];
  const label = mode === 'encrypt' ? 'Encrypted' : 'Decrypted';
  const entries = Object.entries(result);

  if (entries.length === 0) {
    lines.push(colorize('yellow', 'No values to process.'));
    return lines.join('\n');
  }

  lines.push(colorize('cyan', `${label} ${entries.length} value(s):\n`));

  for (const [key, value] of entries) {
    const isEnc = value.startsWith('enc:');
    const displayValue = isEnc
      ? colorize('yellow', value.slice(0, 20) + '...')
      : colorize('green', value);
    lines.push(`  ${colorize('bold', key)} = ${displayValue}`);
  }

  return lines.join('\n');
}

module.exports = { formatEncrypt };
