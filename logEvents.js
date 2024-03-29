// Importing the required modules
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

// Node.js common core global modules
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// Function to log events to a file
const logEvents = async (event, level, message) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${level}\t${event}\t${message}\t${uuid()}`;
    
    // If DEBUG is true, log to the console
    if(DEBUG) console.log(logItem);
    try {
        // TODO: include year and month when managing folders
        // Create a logs folder if it doesn't exist
        if(!fs.existsSync(path.join(__dirname, './logs'))) {
            // include ./logs/yyyy/mmmm
            await fsPromises.mkdir(path.join(__dirname, 'logs'));
        }
        // Include todays date in filename
        const fileName = `${format(new Date(), 'yyyyMMdd')}` + '_events.log';
        if(DEBUG) console.log(fileName); 
        if(DEBUG) console.log(logItem); 
        await fsPromises.appendFile(path.join(__dirname, 'logs', fileName), logItem + '\n');
    } catch (err) {
        console.log(err);
    }
}

// Export the logEvents function for use in other modules
module.exports = logEvents;