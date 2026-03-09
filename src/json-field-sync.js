const fs = require("fs/promises");
const { setLogFileFromOutput, logReplacement, logSuccess, logWarningUsage, logWarning, logError } = require("./logger");

function parseJsonSafe(raw) {
	const cleaned = raw.replace(/^\uFEFF/, "");
	return JSON.parse(cleaned);
}

async function main() {
	const [baseFile, patchFile, outFile, field, matchKey = "id"] = process.argv.slice(2);
	
	if (!baseFile || !patchFile || !outFile || !field) {
		logWarningUsage();
		process.exit(1);
	}

	setLogFileFromOutput(outFile);
	const fields = String(field).split("/").map((value) => value.trim()).filter(Boolean);

	if (fields.length === 0) {
		logWarningUsage();
		process.exit(1);
	}
	
	const base = parseJsonSafe(await fs.readFile(baseFile, "utf8"));
	const patch = parseJsonSafe(await fs.readFile(patchFile, "utf8"));
	
	const patchByKey  = new Map(
		patch
			.filter((item) => Object.prototype.hasOwnProperty.call(item, matchKey))
			.map((item) => [item[matchKey], item])
	);

	let replacements = 0;
	
	const result = base.map((item) => {
		const keyValue = item[matchKey];
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
			logReplacement(keyValue, item[currentField], match[currentField], currentField, matchKey);
			nextItem[currentField] = match[currentField];
		}

		return updated ? nextItem : item;
	});
	
	await fs.writeFile(outFile, `${JSON.stringify(result, null, 2)}\n`, "utf8");
	if (replacements === 0) {
		logWarning(`0 remplacement. Check 'field' (${field}) and 'matchKey' (${matchKey}).`);
	}
	logSuccess(outFile);
}

main().catch((err) => {
	logError(err.message);
	process.exit(1);
});
