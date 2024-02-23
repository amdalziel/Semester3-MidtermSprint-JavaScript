const folders = ['models', 'views', 'routes', 'logs', 'json'];

const configJson = {
    "name": "BestKindBreweryCLI",
    "version": "1.0.0",
    "description": "The Command Line Interface (CLI) for the Best Kind Brewery.",
    "main": "bkbrewery.js",
    "superuser": "admin01",
    "database": "bestkinddb"
  }

  const tokenjson = [{
    created: '2000-01-01 12:30:00',
    username: 'username',
    email: 'user@example.com',
    phone: '5556597890',
    token: 'token',
    expires: '2000-01-04 12:30:00',
    confirmed: 'tbd'
  }];


  module.exports = {
    configJson,
  };