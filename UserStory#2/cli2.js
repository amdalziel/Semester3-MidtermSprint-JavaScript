const fs = require('fs');
const path = require('path');
const { showInitializationStatus, createFolders, createConfigFile } = require('./init2');
const { configApp, setConfig } = require('./config2');

const myArgs = process.argv.slice(2);

const command = myArgs[0];
const option = myArgs.slice(1).join(' ');

const logsFolder = 'logs';
const logFilePath = path.join(__dirname, logsFolder, 'app.log');

// Create logs folder if it doesn't exist
if (!fs.existsSync(path.join(__dirname, logsFolder))) {
    fs.mkdirSync(path.join(__dirname, logsFolder));
    console.debug(`${logsFolder} folder created.`);
}

// Function to log messages to app.log file
function logMessage(message) {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] ${message}\n`;

    fs.appendFile(logFilePath, log, (err) => {
        if (err) throw err;
    });
}
console.debug('Command:', command);
console.debug('Option:', option);

// Function to list all tokens
function listTokens() {
    // Read tokens from a file or database
    const tokens = ['token1', 'token2', 'token3']; // Example list of tokens

    console.log('List of tokens:');
    tokens.forEach((token, index) => {
        console.log(`${index + 1}. ${token}`);
    });
}

// Function to count all tokens
function countTokens() {
    // Read tokens from a file or database and count them
    const tokens = ['token1', 'token2', 'token3']; // Example list of tokens

    console.log(`Total number of tokens: ${tokens.length}`);
}

// Function to create a new token
function createNewToken() {
    // Generate a new token and save it to a file or database
    const newToken = generateNewToken(); // Example function to generate a new token

    console.log(`New token created: ${newToken}`);
}

// Function to generate a new token
function generateNewToken() {
    // Generate a random token
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

switch (command) {
    case 'init':
      console.debug('Executing init command');
        if (option === '--mk') {
            // Logic to create all the app folders
            console.debug('Creating app folders...');
            if (!fs.existsSync(path.join(__dirname, 'data')) || !fs.existsSync(path.join(__dirname, 'logs'))) {
                createFolders();
                console.debug('All app folders created.');
                logMessage('All app folders created.');
            } else {
                console.debug('Folders already exist.');
                logMessage('Folders already exist.');
            }
        } else if (option === '--cat') {
            // Logic to create all the app files
            console.debug('Creating config file...');
            if (!fs.existsSync(path.join(__dirname, 'config.json'))) {
                createConfigFile();
                console.debug('Config file created.');
                logMessage('Config file created.');
            } else {
                console.debug('Config file already exists.');
                logMessage('Config file already exists.');
            }
        } else if (option === '--all') {
            // Logic to create all the folders and files
            console.debug('Initializing app with all folders and files...');
            if (!fs.existsSync(path.join(__dirname, 'data')) || !fs.existsSync(path.join(__dirname, 'logs')) || !fs.existsSync(path.join(__dirname, 'config.json'))) {
                createFolders();
                createConfigFile();
                console.debug('All app folders and files created.');
                logMessage('All app folders and files created.');
            } else {
                console.debug('Folders and config file already exist.');
                logMessage('Folders and config file already exist.');
            }
        } else {
            // Default logic for initializing the app
            console.debug('Displaying initialization status...');
            showInitializationStatus();
            console.debug('Initialization status displayed.');
            logMessage('Initialization status displayed.');
        }
        break;
    case 'config':
      console.debug('Executing config command:', option);
        if (['--show', '--reset', '--set'].includes(option)) {
            configApp(option);
        } else {
            console.debug('Invalid command. Usage: --show, --reset, --set');
            logMessage('Invalid command. Usage: --show, --reset, --set');
        }
        break;
    case 'token':
      console.debug('Executing token command:', option);
        if (['--list', '--count', '--new'].includes(option)) {
          console.debug('Token command executed:', option);
          logMessage(`Token command executed: ${option}`);
            // Logic for token commands
            if (option === '--list') {
                listTokens();
            } else if (option === '--count') {
                countTokens();
            } else if (option === '--new') {
                createNewToken();
            }
        } else {
            console.debug('Invalid command. Usage: --list, --count, --new');
            logMessage('Invalid command. Usage: --list, --count, --new');
        }
        break;
    case '--help':
      console.debug('Displaying help information...');
        const usage = `Usage:\n\ncli2 --help              displays help\ncli2 init                initialize the app\ncli2 init --mk           create all the app folders\ncli2 init --cat          create all the app files\ncli2 init --all          create all the folders and files\ncli2 config              create or change the app configuration\ncli2 config --show       show the contents of the config file\ncli2 config --reset      reset back to default the config file\ncli2 config --set        set a specific attribute of the config file\ncli2 token               manage the user tokens\ncli2 token --list        list all the tokens\ncli2 token --count       provide a count of all the tokens\ncli2 token --new         add a new token\n`;
        console.debug(usage);
        logMessage('Usage displayed.');
        break;
    default:
        console.debug(`Command "${command}" not recognized.`);
        logMessage(`Command "${command}" not recognized.`);
        break;
}
