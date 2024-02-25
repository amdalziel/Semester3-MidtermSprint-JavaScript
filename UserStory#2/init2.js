const fs = require('fs');
const path = require('path');
const { folders, configjson } = require('./templates2');

const logFilePath = path.join(__dirname, 'app.log');

// Function to check if the log file exists, and create it if it doesn't
function ensureLogFileExists() {
    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, ''); // Create an empty log file
    }
}

// Ensure that the log file exists before running any commands
ensureLogFileExists();

function showInitializationStatus() {
    console.log("Initialization: Completed");
}

function logAction(action) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${action}`;
    fs.appendFileSync(logFilePath, logMessage + '\n');
}

function createFolders() {
    logAction("Creating folders:");
    folders.forEach(folder => {
        const folderPath = path.join(__dirname, folder);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
            logAction(`${folder} folder created.`);
        } else {
            logAction(`${folder} folder already exists.`);
        }
    });
}

function createConfigFile() {
    logAction("Creating config file:");
    const configPath = path.join(__dirname, "config.json");
    fs.writeFileSync(configPath, JSON.stringify(configjson, null, 2));
    logAction("Config file created.");
}

module.exports = { showInitializationStatus, createFolders, createConfigFile };
