const color = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    orange: "\x1b[38;5;208m",
    red: "\x1b[31m",
};

function logReplacement(keyValue, oldValue, newValue, field, matchKey) {
    console.log(
        `${color.cyan}${String(matchKey)} ${String(keyValue)}${color.reset}: ${color.yellow}"${String(oldValue)}"${color.reset} -> ${color.green}"${String(newValue)}"${color.reset} on field ${color.orange}${String(field)}${color.reset}`
    );
}

function logSuccess(outputPath) {
    console.log(`${color.green}OK${color.reset} -> ${outputPath}`);
}

function logWarningUsage() {
    console.log(`${color.orange}Usage:${color.reset} node src/merge-json.js <base.json> <patch.json> <out.json> <field> [matchKey]`);
}

function logWarning(message) {
    console.log(`${color.orange}Warning:${color.reset} ${String(message)}`);
}

function logError(error) {
    console.error(`${color.red}Fatal error:${color.reset} ${String(error)}`);
}

module.exports = {
    logReplacement,
    logSuccess,
    logWarningUsage,
    logWarning,
    logError,
};
