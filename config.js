const fs = require('fs');
const myArgs = process.argv.slice(2); 

const { configJson } = require('./templates');

global.DEBUG = true; 

function viewConfigHelp() {
    if(DEBUG) console.log('config.viewConfigHelp()');
    fs.readFile(__dirname + "/usageConfig.txt", (error, data) => {
        if (error) throw error; 
        console.log(data.toString()); 
    }); 
}
 

function viewCurrConfig() {
    if(DEBUG) console.log('config.viewCurrConfig()');
    fs.readFile(__dirname + "/json/config.json", (error, data) => {
        if(error) throw error; 
        console.log(JSON.parse(data));
    });
} 



function resetConfig() {
    if(DEBUG) console.log('config.resetConfig()');
    let configdata = JSON.stringify(configJson, null, 2);
    // if(DEBUG) console.log(__dirname + './json/config.json');
    // if(DEBUG) console.log(configdata);
    fs.writeFile(__dirname + '/json/config.json', configdata, (error) => {
        if(error) throw error;   
        if(DEBUG) console.log('Config file reset to original state');
     });
}



function setConfig() {
    if(DEBUG) console.log('config.setConfig()');
    if(DEBUG) console.log(myArgs);

    let match = false;
    fs.readFile(__dirname + "/json/config.json", (error, data) => {
        if(error) throw error;         
        if(DEBUG) console.log(JSON.parse(data));
        let cfg = JSON.parse(data);
        for(let key of Object.keys(cfg)){
            if(DEBUG) console.log(`K E Y: ${key}`);
            if(key === myArgs[2]) {
                cfg[key] = myArgs[3];
                match = true;
            }
        }
        if(!match) {
            console.log(`Error: ${myArgs[2]} is an invalid key.`)
            return; 
       }
        if(DEBUG) console.log(cfg);
        data = JSON.stringify(cfg, null, 2);
        // looks like this code is writing the file again even if there is
        fs.writeFile(__dirname + '/json/config.json', data, (error) => {
            if (error) throw error;
            if(DEBUG) console.log('Config file successfully updated.');
        });
    });
} 



function configApp() {
    if(DEBUG) console.log('configApp()');
  
    switch (myArgs[1]) {
    case '--help':
    case '--h':
        if(DEBUG) console.log('--help');
        viewConfigHelp(); 
        break; 
    case '--show':
        if(DEBUG) console.log('--show');
        viewCurrConfig();
        break;
    case '--reset':
        if(DEBUG) console.log('--reset');
        resetConfig();
        break;
    case '--set':
        if(DEBUG) console.log('--set');
        setConfig();
        break;
    default:
        fs.readFile(__dirname + "/usage.txt", (error, data) => {
            if(error) throw error;              
            console.log(data.toString());
        });
    }
  }

module.exports = {
    configApp,
  }