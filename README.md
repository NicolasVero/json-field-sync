# 🔁 json-field-sync

## Usage

```bash
node src/json-field-sync.js <base.json> <patch.json> <out.json> <field> [matchKey]
```

Example:

```bash
node src/json-field-sync.js examples/base.json examples/patch.json examples/result.json value
```

Example with custom key (like exercise_id):

```bash
node src/json-field-sync.js base.json patch.json result.json value exercise_id
```

## Logs

Each run writes logs in `/logs` with the format `merge_filename.log`
