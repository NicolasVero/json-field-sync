const fs = require("fs/promises");
const { setLogFileFromOutput, logReplacement, logSuccess, logWarningUsage, logWarning, logError } = require("./logger");

function parseJsonSafe(raw) {
	const cleaned = raw.replace(/^\uFEFF/, "");
	return JSON.parse(cleaned);
}

function parseSlashSeparated(value) {
	return String(value)
		.split("/")
		.map((item) => item.trim())
		.filter(Boolean);
}

function buildCompositeKey(item, keys) {
	const values = [];

	for (const key of keys) {
		if (!Object.prototype.hasOwnProperty.call(item, key)) {
			return null;
		}
		values.push(item[key]);
	}

	return JSON.stringify(values);
}

function buildCompositeKeyDisplay(item, keys) {
	return keys.map((key) => String(item[key])).join("/");
}

async function main() {
	const [baseFile, patchFile, outFile, field, matchKey = "id"] = process.argv.slice(2);
	
	if (!baseFile || !patchFile || !outFile || !field) {
		logWarningUsage();
		process.exit(1);
	}

	setLogFileFromOutput(outFile);
	const fields = parseSlashSeparated(field);
	const matchKeys = parseSlashSeparated(matchKey);

	if (fields.length === 0 || matchKeys.length === 0) {
		logWarningUsage();
		process.exit(1);
	}

	const matchKeyLabel = matchKeys.join("/");
	
	const base = parseJsonSafe(await fs.readFile(baseFile, "utf8"));
	const patch = parseJsonSafe(await fs.readFile(patchFile, "utf8"));
	
	const patchByKey  = new Map(
		patch
			.map((item) => {
				const key = buildCompositeKey(item, matchKeys);
				return key === null ? null : [key, item];
			})
			.filter(Boolean)
	);

	let replacements = 0;
	
	const result = base.map((item) => {
		const keyValue = buildCompositeKey(item, matchKeys);
		if (keyValue === null) {
			return item;
		}

		const keyValueDisplay = buildCompositeKeyDisplay(item, matchKeys);
		const match = patchByKey .get(keyValue);
		if (!match) {
			return item;
		}

		const nextItem = { ...item };
		let updated = false;

		for (const currentField of fields) {
			if (!(currentField in match)) {
				continue;
			}

			replacements += 1;
			updated = true;
			logReplacement(keyValueDisplay, item[currentField], match[currentField], currentField, matchKeyLabel);
			nextItem[currentField] = match[currentField];
		}

		return updated ? nextItem : item;
	});
	
	await fs.writeFile(outFile, `${JSON.stringify(result, null, 2)}\n`, "utf8");
	if (replacements === 0) {
		logWarning(`0 remplacement. Check 'field' (${field}) and 'matchKey' (${matchKeyLabel}).`);
	}
	logSuccess(outFile);
}

main().catch((err) => {
	logError(err.message);
	process.exit(1);
});
