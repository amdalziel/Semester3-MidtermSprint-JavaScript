// Settings: DEBUG = true|false
global.DEBUG = false;

// Import the required modules
const fs = require("fs");

// Importing app initialization, configuration, and token generation functions
const { initializeApp } = require('./init.js');
const { configApp } = require('./config.js');
const { tokenApp } = require('./token.js');

// Retrieve the command line arguments
const myArgs = process.argv.slice(2);

// Checking if DEBUG mode is enabled and logging command line arguments if present
if(DEBUG) if(myArgs.length >= 1) console.log('the bkbrewery.args: ', myArgs);

// Switch statement to determine which function to call based on the command line arguments
switch (myArgs[0]) {
  case 'init':
  case 'i':
    // Initialize the app
      if(DEBUG) console.log(myArgs[0], ' - initialize the app.');
      initializeApp();
      break;
  case 'config':
  case 'c':
    // Display the configuration file
      if(DEBUG) console.log(myArgs[0], ' - display the configuration file');
      configApp();
      break;
  case 'token':
  case 't':
    // Generate a user token
      if(DEBUG) console.log(myArgs[0], ' - generate a user token');
      tokenApp();
      break;  
  case '--help':
  case '--h':
  default:
    // Displaying usage information if no arguments are provided
      fs.readFile(__dirname + "/usage.txt", (error, data) => {
          if(error) throw error;
          console.log();
          console.log(data.toString());
          console.log();
      });
}