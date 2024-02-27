const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;
// Add logging to the CLI project by using eventLogging
// load the logEvents module
const logEvents = require('./logEvents');

// define/extend an EventEmitter class
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {};

// initialize an new emitter object
const myEmitter = new MyEmitter();
// add the listener for the logEvent
myEmitter.on('log', (event, level, msg) => logEvents(event, level, msg));
const { folders, configjson, tokenjson } = require('./templates');

const DEBUG = true;

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
            return 
        } else {
        console.log("Public folder (with subdirectories) was created."); 
        }
    } catch (err) {
        console.error('Error creating folder:', err.message);
    }
}


async function createFolders() {
    if (DEBUG) console.log('init.createFolders()');
    createPublicDirectory(); 
 
    let folderCreated = []; 
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
        console.log('All folders already exist');
    } else {
        console.log(`Folder(s) created: ${folderCreated}.`);
    }
}

function createFiles() {
    if (DEBUG) console.log('init.createFiles()');
    try {
        let configdata = JSON.stringify(configjson, null, 2);
        if (!fs.existsSync(path.join(__dirname, './json/config.json'))) {
            fsPromises.writeFile('./json/config.json', configdata)
            .then(() => {
                console.log('Data written to config file.');
            })
            .catch((err) => {
                console.error('Error writing to config file:', err.message);
            });
    } else {
        console.log('config file already exists.');
            
        }
        let tokendata = JSON.stringify(tokenjson, null, 2);
        if (!fs.existsSync(path.join(__dirname, './json/tokens.json'))) {
            fsPromises.writeFile('./json/tokens.json', tokendata)
            .then(() => {
                console.log('Data written to tokens file.');
            })
            .catch ((err) => {
                console.error('Error writing to tokens file:', err.message);
            }); 
        } else {
            console.log('tokens file already exists.');
        }

    } catch (err) {
        console.error('Error creating files:', err.message);
    }
}

const myArgs = process.argv.slice(2);
console.log('Command-line arguments:', myArgs);

function initializeApp() {
  if (DEBUG) console.log('initializeApp()');

  switch (myArgs[1]) {
      case '--all':
          if (DEBUG) console.log('--all createFolders() & createFiles()');
          createFolders();
          createFiles();
          break;
      case '--cat':
          if (DEBUG) console.log('--cat createFiles()');
          createFiles();
          break;
      case '--mk':
          if (DEBUG) console.log('--mk createFolders()');
          createFolders();
          break;
      case '--help':
      case '--h':
        default:
          console.log('Reading usage file...');
          fs.readFile(__dirname + "/usageinit.txt", (error, data) => {
              if (error) {
                  console.error('Error reading usage file:', error.message);
                  throw error;
              }
              console.log('Usage information:', data.toString());
          });

  }
}

module.exports = {
    initializeApp,
};
