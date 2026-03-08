const fs = require("fs/promises");

async function main() {
	const [baseFile, patchFile, outFile, field = "value"] = process.argv.slice(2);
	
	if (!baseFile || !patchFile || !outFile) {
		console.log("Usage: node src/merge-json.js <base.json> <patch.json> <out.json> [field]");
		process.exit(1);
	}
	
	const base = JSON.parse(await fs.readFile(baseFile, "utf8"));
	const patch = JSON.parse(await fs.readFile(patchFile, "utf8"));
	
	const patchById = new Map(patch.map((item) => [item.id, item]));
	
	const result = base.map((item) => {
		const match = patchById.get(item.id);
		if (!match || !(field in match)) return item;
		return { ...item, [field]: match[field] };
	});
	
	await fs.writeFile(outFile, `${JSON.stringify(result, null, 2)}\n`, "utf8");
	console.log(`OK -> ${outFile}`);
}

main().catch((err) => {
	console.error(err.message);
	process.exit(1);
});
