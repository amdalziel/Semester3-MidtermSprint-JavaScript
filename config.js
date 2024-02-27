const fs = require("fs").promises; // Note: Use fs.promises for async/await support.
const path = require("path"); // Using the path module for better path handling

const { configjson } = require("./templates");

const myArgs = process.argv.slice(2);

const DEBUG = true; // Changed to a constant within the module scope.

// Async function to read the config file and return the parsed JSON
async function readConfigFile() {
  const filePath = path.join(__dirname, "json", "config.json");
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

// Async function to write to the config file
async function writeConfigFile(data) {
  const filePath = path.join(__dirname, "json", "config.json");
  const dataString = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, dataString);
}

// Helper function to log if debugging is enabled
function debugLog(message) {
  if (DEBUG) {
    console.log(message);
  }
}

async function viewConfigHelp() {
  debugLog("config.viewConfigHelp()");
  try {
    const data = await fs.readFile(
      path.join(__dirname, "usageConfig.txt"),
      "utf8"
    );
    console.log(data);
  } catch (error) {
    console.error("Error viewing config help:", error);
  }
}

async function viewCurrConfig() {
  debugLog("config.viewCurrConfig()");
  try {
    const config = await readConfigFile();
    console.log(config);
  } catch (error) {
    console.error("Error viewing current config:", error);
  }
}

async function resetConfig() {
  debugLog("config.resetConfig()");
  try {
    await writeConfigFile(configjson);
    debugLog("Config file reset to original state");
  } catch (error) {
    console.error("Error resetting config:", error);
  }
}

async function setConfig(key, value) {
  debugLog("config.setConfig()");
  try {
    const config = await readConfigFile();
    if (config.hasOwnProperty(key)) {
      config[key] = value;
      await writeConfigFile(config);
      debugLog("Config file successfully updated.");
    } else {
      console.error(`Error: ${key} is an invalid key.`);
    }
  } catch (error) {
    console.error("Error setting config:", error);
  }
}

async function configApp() {
  debugLog("configApp()");

  try {
    switch (myArgs[1]) {
      case "--help":
      case "--h":
        debugLog("--help");
        await viewConfigHelp();
        break;
      case "--show":
        debugLog("--show");
        await viewCurrConfig();
        break;
      case "--reset":
        debugLog("--reset");
        await resetConfig();
        break;
      case "--set":
        debugLog("--set");
        if (myArgs.length >= 4) {
          await setConfig(myArgs[2], myArgs[3]);
        } else {
          console.error("Error: Missing arguments for --set");
        }
        break;
      default:
        const usageData = await fs.readFile(
          path.join(__dirname, "usage.txt"),
          "utf8"
        );
        console.log(usageData);
    }
  } catch (error) {
    console.error("Error in configApp:", error);
  }
}

// Export the configApp function
module.exports = {
  configApp,
};