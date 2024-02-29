// Array of folders to be created at startup
const folders = ['logs', 'json'];
// public folder handled separately

// Configuration settings for the CLI
const configjson = {
    "name": "BestKindBreweryCLI",
    "version": "1.0.0",
    "description": "The Command Line Interface (CLI) for the Best Kind Brewery.",
    "main": "bkbrewery.js",
    "superuser": "admin01",
    "database": "bestkinddb"
  }

  // Initial token data stored in JSON format
  const tokenjson = [{
    created: '2000-01-01 12:30:00',
    username: 'username',
    email: 'user@example.com',
    phone: '5556597890',
    token: 'token',
    expires: '2000-01-04 12:30:00',
    confirmed: 'tbd'
  }];


  // Export the configuration settings, token data, and folder array used in the CLI
  module.exports = {
    configjson,
    tokenjson,
    folders,
  };