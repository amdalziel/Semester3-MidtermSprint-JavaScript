const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;
const { folders, configjson, tokenjson } = require('./templates');

// load the logEvents module
const logEvents = require("./logEvents");

// Create an instance of EventEmitter
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// Emit 'logs' event with logEvents data
eventEmitter.on('logs', (event, level, msg) => logEvents(event, level, msg));

const DEBUG = true;

async function makeAll() {
    if (DEBUG) console.log('init.makeAll()');

    await createFolders();
    await createFiles();
}


async function createPublicDirectory() {
    let publicFoldersCount = 0; 
    try {
        if (!fs.existsSync(path.join(__dirname, 'public'))) {
            await fsPromises.mkdir(path.join(__dirname, 'public'));
            publicFoldersCount++; 
        }
        if (!fs.existsSync(path.join(__dirname, 'public', 'css'))) {
            await fsPromises.mkdir(path.join(__dirname, 'public', 'css'));
            publicFoldersCount++; 
        }
        if (!fs.existsSync(path.join(__dirname, 'public', 'images'))) {
            await fsPromises.mkdir(path.join(__dirname, 'public', 'images'));
            publicFoldersCount++; 
        }
        if (!fs.existsSync(path.join(__dirname, 'public', 'views'))) {
            await fsPromises.mkdir(path.join(__dirname, 'public', 'views'));
            publicFoldersCount++; 
        }
        if(publicFoldersCount === 0) {
            return false; 
        } else {
        return true; 
        }
    } catch (err) {
        console.error('Error creating folder:', err.message);
        return false; 
    }
}


async function createFolders() {
    if (DEBUG) console.log('init.createFolders()');

    let folderCreated = []; 

    let publicStatus = await createPublicDirectory(); 
    if(publicStatus === true) {
        folderCreated.push('public'); 
    }
 
    folders.forEach(element => {
        try {
            if (!fs.existsSync(path.join(__dirname, element))) {
                fsPromises.mkdir(path.join(__dirname, element))
                folderCreated.push(element); 
            }
        } catch (err) {
            console.error('Error creating folder:', err.message);
        }
    });
    if (folderCreated.length === 0) {
        console.log('All folders already exist.');
        console.log(); 
    } else {
        console.log(`Folder(s) created: ${folderCreated}.`);
        console.log(); 
    }
     // Emitting 'logs' event after folder creation
     eventEmitter.emit('logs', 'createFolders()', 'INFO', 'Folders created successfully');
}

function createFiles() {
    if (DEBUG) console.log('init.createFiles()');
    try {
        let configdata = JSON.stringify(configjson, null, 2);
        if (!fs.existsSync(path.join(__dirname, './json/config.json'))) {
            fsPromises.writeFile('./json/config.json', configdata)
            .then(() => {
                console.log('Data written to config file.');
                console.log(); 
            })
            .catch((err) => {
                console.error('Error writing to config file:', err.message);
                console.log(); 
            });
    } else {
        console.log('Config file already exists.');
        console.log(); 
            
        }
        let tokendata = JSON.stringify(tokenjson, null, 2);
        if (!fs.existsSync(path.join(__dirname, './json/tokens.json'))) {
            fsPromises.writeFile('./json/tokens.json', tokendata)
            .then(() => {
                console.log('Data written to tokens file.');
                console.log(); 
            })
            .catch ((err) => {
                console.error('Error writing to tokens file:', err.message);
                console.log(); 
            }); 
        } else {
            console.log('Tokens file already exists.');
            console.log(); 
        }
        // Emitting 'logs' event after file creation
        eventEmitter.emit('logs', 'createFiles()', 'INFO', 'Files created successfully');

    } catch (err) {
        console.error('Error creating files:', err.message);
        console.log(); 
    }
}

const myArgs = process.argv.slice(2);
console.log('Command-line arguments:', myArgs);

function initializeApp() {
  if (DEBUG) console.log('initializeApp()');

  switch (myArgs[1]) {
      case '--all':
          if (DEBUG) console.log('--all createFolders() & createFiles()');
          console.log(); 
          console.log("** Init Folders and Files Status **"); 
          console.log(); 
          makeAll(); 
          break;
      case '--cat':
          if (DEBUG) console.log('--cat createFiles()');
          console.log(); 
          console.log("** Init Files Status **"); 
          createFiles();
          break;
      case '--mk':
          if (DEBUG) console.log('--mk createFolders()');
          console.log(); 
          console.log("** Init Folders Status **"); 
          createFolders();
          break;
      case '--help':
      case '--h':
        default:
          console.log('Reading usage file...');
          fs.readFile(__dirname + "/usageInit.txt", (error, data) => {
              if (error) {
                  console.error('Error reading usage file:', error.message);
                  throw error;
              }
              console.log(); 
              console.log(data.toString());
              console.log(); 
          });

  }
}

module.exports = {
    initializeApp,
};
