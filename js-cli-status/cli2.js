#!/usr/bin/env node

const fs = require('fs');
const { Command } = require('commander');

// Create a new instance of the program
const program = new Command();

program
  .version('1.0.0')
  .description('CLI tool to provide status for initialization and configuration of JavaScript files');

program
  .command('status <file>')
  .description('Check status for initialization and configuration of a JavaScript file')
  .action((file) => {
    // Check if the file exists
    if (!fs.existsSync(file)) {
      console.log(`File '${file}' does not exist.`);
      return;
    }

    // Read the content of the file
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err.message}`);
        return;
      }

      // Check if the file contains initialization and configuration
      if (data.includes('initialize()') && data.includes('configure()')) {
        console.log(`File '${file}' is initialized and configured.`);
      } else {
        console.log(`File '${file}' is not initialized or configured.`);
      }
    });
  });

program.parse(process.argv);
