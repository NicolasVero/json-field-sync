const fs = require("fs");
const path = require("path");

const color = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    orange: "\x1b[38;5;208m",
    red: "\x1b[31m",
};

const logsDir = path.join(process.cwd(), "logs");
let logFilePath = path.join(logsDir, "merge.log");

function ensureLogsDir() {
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
}

function setLogFileFromOutput(outputPath) {
    ensureLogsDir();
    const outputName = path.basename(String(outputPath), path.extname(String(outputPath)));
    logFilePath = path.join(logsDir, `merge_${outputName}.log`);
}

function stripAnsi(input) {
    return String(input).replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "");
}

function writeToFile(level, message) {
    ensureLogsDir();
    const line = `[${new Date().toISOString()}] [${level}] ${stripAnsi(message)}\n`;
    fs.appendFileSync(logFilePath, line, "utf8");
}

function logReplacement(keyValue, oldValue, newValue, field, matchKey) {
    const message = `${color.cyan}${String(matchKey)} ${String(keyValue)}${color.reset}: ${color.yellow}"${String(oldValue)}"${color.reset} -> ${color.green}"${String(newValue)}"${color.reset} on field ${color.orange}${String(field)}${color.reset}`;
    console.log(message);
    writeToFile("INFO", message);
}

function logSuccess(outputPath) {
    const message = `${color.green}OK${color.reset} -> ${outputPath}`;
    console.log(message);
    writeToFile("INFO", message);
}

function logWarningUsage() {
    const message = `${color.orange}Usage:${color.reset} node src/json-field-sync.js <base.json> <patch.json> <out.json> <field|field1/field2> [matchKey]`;
    console.log(message);
    writeToFile("WARN", message);
}

function logWarning(message) {
    const formatted = `${color.orange}Warning:${color.reset} ${String(message)}`;
    console.log(formatted);
    writeToFile("WARN", formatted);
}

function logError(error) {
    const message = `${color.red}Fatal error:${color.reset} ${String(error)}`;
    console.error(message);
    writeToFile("ERROR", message);
}

module.exports = {
    setLogFileFromOutput,
    logReplacement,
    logSuccess,
    logWarningUsage,
    logWarning,
    logError,
};
