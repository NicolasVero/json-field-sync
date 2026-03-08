# json-modifier

## Usage

```bash
node src/merge-json.js <base.json> <patch.json> <out.json> <field> [matchKey]
```

Example:

```bash
node src/merge-json.js examples/base.json examples/patch.json examples/result.json value
```

Example with custom key (like exercise_id):

```bash
node src/merge-json.js base.json patch.json result.json value exercise_id
```

## Logs

Each run writes logs in `/logs` with the format `merge_filename.log`
