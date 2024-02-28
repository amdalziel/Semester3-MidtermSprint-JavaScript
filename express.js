// Importing necessary modules for file system operations and path manipulation
const path = require("path");
const fs = require("fs");

// Importing Express and body-parser middleware
const express = require("express");
const bodyParser = require("body-parser");

// Creating an instance of express
const app = express();

// Importing the newWebToken function from token.js
const { newWebToken } = require("./token");

// Importing the logEvents module 
const logEvents = require("./logEvents");


// Importing the EventEmitter to emit events
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

// Emitting 'logs' event with logEvents data
myEmitter.on("logs", (event, level, msg) => logEvents(event, level, msg));

// Body Parser Middleware
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Setting the port number
const port = 3000;

// Setting the DEBUG flag
global.DEBUG = true;

// Setting the view engine and views directory to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

// Serving static files from the public directory
app.use(express.static("public"));
app.use(express.json());

// Route for the root URL
app.get("/", (req, res) => {
  if (DEBUG) console.log("Route: root");
  res.render("home.ejs");
});

// Route for saving tokens from browser (POST request)
app.post("/api/storeToken", urlencodedParser, (req, res) => {
  const newTokenData = req.body;
  if (DEBUG) console.log(newTokenData);

  let newToken = newWebToken(
    newTokenData.username,
    newTokenData.email,
    newTokenData.phone
  );

  // Reading the tokens.json file
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) {
      // Emitting 'logs' event in case of error reading tokens.json
      myEmitter.emit(
        "logs",
        "newWebToken()",
        "INFO",
        `Error reading tokens.json: ${error}`
      );
      res.render("failMess.ejs");
      return;
    }
    let tokens = JSON.parse(data);
    tokens.push(newToken);
    userTokens = JSON.stringify(tokens, null, 2);

    // Writting the new token to the tokens.json file
    fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
      if (err) {
        // Emitting 'logs' event in case of error writing tokens.json
        myEmitter.emit(
          "logs",
          "newWebToken()",
          "INFO",
          `Error writing a token from the browser to file: ${err}.`
        );
        res.render("failMess.ejs");
        console.log(err);
        return;
      } else {
        console.log();
        console.log("** Success **");
        console.log(
          `New token ${newToken.token} was created for ${newToken.username}.`
        );
        console.log();
        myEmitter.emit(
          "logs",
          "newWebToken()",
          "INFO",
          `New token ${newToken.token} was created for ${newToken.username}.`
        );
        res.render("successMess.ejs", { tok: newToken.token });
      }
    });
  });
});

// Route for handling 404 errors
app.use((request, response) => {
  response.status(404).write("404: Content not found");
  response.end();
});

// Staring the server and listening on port 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
