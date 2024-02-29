const fs = require('fs');
const { configApp } = require('./config');

const myArgs = process.argv.slice(2);

switch (myArgs[0]) {
  case '--help':
    case '-h':
      fs.readFile(__dirname + "/usage.txt", (error, data) => {
        if(error) throw error;
        console.log(data.toString());
      });
      break;
      default:
        configApp();
        break;
}