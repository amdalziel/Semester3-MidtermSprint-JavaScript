const fs = require('fs');
const { showInitializationStatus } = require('./init');
const { showConfigurationStatus, configApp } = require('./config'); 

const myArgs = process.argv.slice(2);

switch (myArgs[0]) {
  case 'init-status':
    showInitializationStatus();
    break;
  case 'config-status':
    showConfigurationStatus();
    break;
  case 'config':
    configApp();
    break;
  default:
    fs.readFile(__dirname + "/usage.txt", 'utf8', (error, data) => {
      if(error) {
        if(error.code ==='ENOENT') {
          console.log("Usage file not found. Please ensure it exists.");
        } else {
          throw error;
        }
      } else {
        console.log(data);
      }
      
    });
}