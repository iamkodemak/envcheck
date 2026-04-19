# envcheck

CLI tool to validate and diff `.env` files across environments.

## Installation

```bash
npm install -g envcheck
```

## Usage

Compare two `.env` files to find missing or mismatched keys:

```bash
envcheck diff .env .env.production
```

Validate a `.env` file against a `.env.example` template:

```bash
envcheck validate .env --template .env.example
```

Example output:

```
✔ All required keys present
✘ Missing keys: DATABASE_URL, REDIS_HOST
~ Extra keys not in template: DEBUG_MODE
```

### Options

| Flag | Description |
|------|-------------|
| `--template` | Path to the reference `.env` file |
| `--strict` | Fail if extra keys are found |
| `--json` | Output results as JSON |
| `--silent` | Suppress output, rely on exit code only |

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Validation passed |
| `1` | Missing or mismatched keys found |
| `2` | File not found or unreadable |

## License

MIT
