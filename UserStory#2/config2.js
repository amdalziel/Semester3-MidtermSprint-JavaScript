const fs = require('fs');
const path = require('path');

function configApp(option) {
    switch (option) {
        case '--show':
            displayConfig();
            break;
        case '--reset':
            resetConfig();
            break;
        case '--set':
            console.log('Setting configuration...');
            // Add logic to set configuration
            break;
        default:
            if (!option) {
                console.log('Invalid command. Usage: --show, --reset, --set');
            } else {
                console.log(`Invalid option "${option}" for config command. Usage: --show, --reset, --set`);
            }
    }
}

function displayConfig() {
    fs.readFile(path.join(__dirname, "config.json"), (error, data) => {
        if (error) {
            console.log('Error reading config file:', error.message);
            return;
        }
        console.log(JSON.parse(data));
    });
}

function resetConfig() {
    const configPath = path.join(__dirname, "config.json");
    const defaultConfig = {
        name: "MyApp",
        version: "1.0.0",
        description: "Configuration for MyApp"
    };
    fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2), (error) => {
        if (error) {
            console.log('Error resetting config file:', error.message);
            return;
        }
        console.log("Configuration file reset to default.");
    });
}

module.exports = { configApp };

