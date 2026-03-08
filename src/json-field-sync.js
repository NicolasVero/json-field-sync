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
		if (!match || !(field in match)) {
			return item;
		}

		replacements += 1;
		logReplacement(keyValue, item[field], match[field], field, matchKey);
		return { ...item, [field]: match[field] };
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
