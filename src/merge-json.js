const fs = require("fs/promises");
const { logReplacement, logSuccess, logWarningUsage, logError } = require("./logger");

async function main() {
	const [baseFile, patchFile, outFile, field = "value"] = process.argv.slice(2);
	
	if (!baseFile || !patchFile || !outFile) {
		logWarningUsage();
		process.exit(1);
	}
	
	const base = JSON.parse(await fs.readFile(baseFile, "utf8"));
	const patch = JSON.parse(await fs.readFile(patchFile, "utf8"));
	
	const patchById = new Map(patch.map((item) => [item.id, item]));
	
	const result = base.map((item) => {
		const match = patchById.get(item.id);
		if (!match || !(field in match)) {
			return item;
		}

		logReplacement(item.id, item[field], match[field], field);
		return { ...item, [field]: match[field] };
	});
	
	await fs.writeFile(outFile, `${JSON.stringify(result, null, 2)}\n`, "utf8");
	logSuccess(outFile);
}

main().catch((err) => {
	logError(err.message);
	process.exit(1);
});
