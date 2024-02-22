const fs = require('fs');

function showConfigurationStatus() {
  const configStatus = true;
  if (configStatus) {
    console.log("Configuration: Completed");
  } else {
    console.log("Configuration: Pending");
  }
}

function configApp() {
  console.log("Configuring the application...");
}

module.exports = {
  showConfigurationStatus,
  configApp
};