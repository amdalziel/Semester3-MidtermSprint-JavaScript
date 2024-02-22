const fs = require('fs');

function checkInitialization() {
  return true;
}

function showInitializationStatus() {
  if (checkInitialization()) {
    console.log("Initialization: Completed");
  } else {
    console.log("Initialization: Pending");
  }
}

function showConfigurationStatus() {
  const configStatus = true;
  if (configStatus) {
    console.log("Configuration: Completed");
  } else {
    console.log("Configuration: Pending");
  }
}

module.exports = {
  showInitializationStatus,
  showConfigurationStatus
};