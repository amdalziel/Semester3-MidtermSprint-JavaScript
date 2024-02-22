const fs = require('fs');
const path = require('path');

const myArgs = process.argv.slice(2);
const DEBUG = true;

function displayConfig() {
  if(DEBUG) console.log('config.displayConfig()');
  fs.readFile(path.join(__dirname, 'json', 'config.json'), (error, data) => {
    if(error) throw error;
    console.log(JSON.parse(data));
  });
}

function resetConfig() {
  if(DEBUG) console.log('config.resetConfig()');
  let configjson = {};
  let configdata = JSON.stringify(configjson, null, 2);
  fs.writeFileSync(path.join(__dirname, 'json', 'config.json'), configdata, (error) => {
    if(error) throw error;
    if(DEBUG) console.log('Config file reset to original state');
  });
}

function setConfig() {
  if(DEBUG) console.log('config.setConfig()');
  if(DEBUG) console.log(myArgs);

  let match = false;
  fs.readFile(path.join(__dirname, 'json', 'config.json'), (error, data) => {
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
      console.log(`invalid key: $myArgs[2]}, try another.`)
    }
    if(DEBUG) console.log(cfg);
    data = JSON.stringify(cfg, null, 2);
    fs.writeFile(path.join(__dirname, 'json', 'config.json'), data, (error) => {
      if (error) throw error;
      if(DEBUG) console.log('Config file successfully updated.');
      
  });
});
}

function configApp() {
  if(DEBUG) console.log('configApp()');

  switch (myArgs[1]) {
    case '--show':
      if(DEBUG) console.log('--show');
      displayConfig();
      break;
    case '--reset':
      if(DEBUG) console.log('--reset');
      resetConfig();
      break;
    case '--set':
      if(DEBUG) console.log('--set');
    default:
      fs.readFile(path.join(__dirname, 'usage.txt'), (error, data) => {
      if(error) throw error;
      console.log(data.toString());
    });
  }
}

module.exports = {
  configApp,
};
