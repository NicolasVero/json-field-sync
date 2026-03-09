# 🔁 json-field-sync

## Usage

```bash
node src/json-field-sync.js <base.json> <patch.json> <out.json> <field> [matchKey]
```

`field` can be a single field (`value`) or multiple fields separated by `/` (`value/status/label`).

Example:

```bash
node src/json-field-sync.js examples/base.json examples/patch.json examples/result.json value
```

Example with multiple fields:

```bash
node src/json-field-sync.js examples/base.json examples/patch.json examples/result.json value/title/status
```

Example with custom key (like exercise_id):

```bash
node src/json-field-sync.js base.json patch.json result.json value exercise_id
```

## Logs

Each run writes logs in `/logs` with the format `merge_filename.log`
