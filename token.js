const fs = require("fs"); // File system
const path = require("path"); // Path
const validator = require("validator"); // Validator
const crc32 = require("crc/crc32"); // CRC32
const { format } = require("date-fns"); // Date formatting

const myArgs = process.argv.slice(2); // Command-line arguments

const logEvents = require("./logEvents"); // Log events
const EventEmitter = require("events"); // Event emitter

const myEmitter = new EventEmitter(); // Instance of event emitter

// Event listener for logs
myEmitter.on("logs", (event, level, msg) => logEvents(event, level, msg));

// Function to display help information
function tokenHelp() {
  if (DEBUG) console.log("token.tokenHelp()");
  fs.readFile(__dirname + "/usageToken.txt", (error, data) => {
    if (error) throw error;
    console.log();
    console.log(data.toString());
    console.log();
    myEmitter.emit("logs", "tokenHelp()", "INFO", "tokenHelp function called");
  });
}

// Function to count the number of tokens
function tokenCount() {
  if (DEBUG) console.log("token.tokenCount()");
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);
    console.log();
    console.log("** Number of Tokens ** ");
    let numTokens = 0;
    tokens.forEach((obj) => {
      numTokens++;
    });
    console.log(numTokens);
    console.log();
    myEmitter.emit(
      "logs",
      "tokenCount()",
      "INFO",
      `Number of tokens: ${numTokens}`
    );
  });
}


// Function to validate email
function isValidEmail(email) {
  return validator.isEmail(email, {
    allow_display_name: true, // Optional, allows display name in email
    require_display_name: false,
    allow_utf8_local_part: true,
    require_tld: true, // Ensure there's a top-level domain
  });
}

// Function to validate phone number
function isValidPhone(phone) {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
}

// Function to create a new token
function newToken(username, email, phone) {
  if (DEBUG) console.log("token.newToken()");

  // Validate email and phone before creating a new token
  if (!isValidEmail(email)) {
    console.error("Error: Invalid email format.");
    return null; // Return null to indicate failure to create token
  }

  if (!isValidPhone(phone)) {
    console.error("Error: Phone number must be 10 digits, with no symbols.");
    return null; // Return null to indicate failure to create token
  }

  // Create a new token with validated email and phone
  let newToken = {
    created: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    username: username,
    email: email,
    phone: phone,
    token: crc32(username).toString(16),
    expires: format(addDays(new Date(), 2), "yyyy-MM-dd HH:mm:ss"),
    confirmed: "tbd",
  };

  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);
    tokens.push(newToken);
    let userTokens = JSON.stringify(tokens, null, 2);

    fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
      if (err) console.log(err);
      else {
        console.log();
        console.log("** Success **");
        console.log(`New token ${newToken.token} was created for ${username}.`);
        console.log();
        myEmitter.emit(
          "logs",
          "newToken()",
          "INFO",
          `New token ${newToken.token} was created for ${username}.`
        );
      }
    });
  });

  return newToken.token;
}

// Function to generate a new web token
function newWebToken(user, email, phone) {
  let newToken = JSON.parse(`{
        "created": "2000-01-01 12:30:00",
        "username": "username",
        "email": "user@email.com",
        "phone": "2223334444",
        "token": "token",
        "expires": "2000-01-04 12:30:00",
        "confirmed": "tbd"
    }`);

  let now = new Date();
  let expires = addDays(now, 3);

  let formatPhone = phone.replace(/-/g, "");

  newToken.created = `${format(now, "yyyy-MM-dd HH:mm:ss")}`;
  newToken.username = user;
  newToken.email = email;
  newToken.phone = formatPhone;
  newToken.token = crc32(user).toString(16);
  newToken.expires = `${format(expires, "yyyy-MM-dd HH:mm:ss")}`;

  if (DEBUG) console.log(newToken);
  return newToken;
}

// Function to add days to a date
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Function to update a token
function updateToken(usrName, changeValue, type) {
  if (DEBUG) console.log("token.updateToken()");

  // Perform validation based on the type of value being updated
  if (type === "email" && !isValidEmail(changeValue)) {
    console.error("Error: Invalid email format.");
    return;
  } else if (type === "phone" && !isValidPhone(changeValue)) {
    console.error("Error: Invalid phone format.");
    return;
  }

  // Define the file path
  const filePath = path.join(__dirname, "/json/tokens.json");

  fs.readFile(filePath, "utf-8", (error, data) => {
    if (error) throw error;

    let tokens = JSON.parse(data);
    let found = false;

    // Update the token if the username matches
    tokens.forEach((obj) => {
      if (obj.username === usrName) {
        obj[type] = changeValue;
        found = true;
      }
    });
    let selectedToken = tokens.find((obj) => {
      return obj.username === usrName;
    });
    // If the user was found and updated, then proceed to save the file
    if (found) {
      let userTokens = JSON.stringify(tokens, null, 2); // null and 2 for pretty-printing

      fs.writeFile(filePath, userTokens, (err) => {
        if (err) console.error(err);
        else {
          console.log();
          console.log("** Success **");
          console.log(
            `Token for ${usrName} was updated with new ${type}: ${changeValue}`
          );
          console.log();
          myEmitter.emit(
            "logs",
            "updateToken()",
            "INFO",
            `Updated token: ${JSON.stringify(selectedToken)}`
          );
        }
      });
    } else {
      console.error(`Error: Username ${usrName} not found.`);
    }
  });
}

module.exports = {
  updateToken,
};

// Function to search for a token
function searchToken(value, type) {
  if (DEBUG) console.log("token.searchToken()");

  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);

    let selectToken = null;
    tokens.forEach((token) => {
      if (token[type] === value) {
        if (DEBUG) {
          console.log(token);
        }
        selectToken = token.token;
      }
    });

    if (selectToken == null) {
      console.log(`Error: token with this ${type} not found.`);
    } else {
      console.log();
      console.log("** Success **");
      console.log(`${type.toUpperCase()} found with token: ${selectToken}`);
      console.log();
    }
  });
}

// Function to handle token-related commands from the CLI 
function tokenApp() {
  if (DEBUG) console.log("tokenApp()");
  myEmitter.emit(
    "logs",
    "tokenApp()",
    "INFO",
    "token option was called by CLI"
  );

  switch (myArgs[1]) {
    case "--help":
      if (DEBUG) console.log("--help");
      tokenHelp();
      break;
    case "--count":
      if (DEBUG) console.log("--count");
      tokenCount();
      break;
    case "--new":
      if (myArgs.length < 5) {
        console.log(
          "invalid syntax. node bkbrewery token --new [username] [email] [phone]"
        );
      } else {
        newToken(myArgs[2], myArgs[3], myArgs[4]);
      }
      break;
    case "--upd":
      if (DEBUG) console.log("--upd");
      if (myArgs[2] != "p" && myArgs[2] != "e") {
        console.log("Error: please enter a valid command.");
        return;
      }
      if (myArgs[2] === "p") {
        if (myArgs.length < 5) {
          console.log(
            "Error: please use the following syntax: \nnode bkbrewery token --upd p [username] [phone]"
          );
        } else {
          if (DEBUG) console.log("--upd p");
          updateToken(myArgs[3], myArgs[4], "phone");
        }
        break;
      } else {
        if (myArgs.length < 5) {
          console.log(
            "Error: please use the following syntax: \nnode bkbrewery token --upd e [username] [email]"
          );
        } else {
          if (DEBUG) console.log("--upd e");
          updateToken(myArgs[3], myArgs[4], "email");
        }
        break;
      }
    case "--search":
      if (DEBUG) console.log("--search");
      if (myArgs[2] != "u" && myArgs[2] != "e" && myArgs[2] != "p") {
        console.log("Error: please enter a valid command.");
        return;
      }
      if (myArgs[2] === "u") {
        if (myArgs.length < 4) {
          console.log(
            "Error: please use the following syntax: \nnode bkbrewery token --search u [username]"
          );
        } else {
          if (DEBUG) console.log("--search u");
          searchToken(myArgs[3], "username");
        }
        break;
      }
      if (myArgs[2] === "e") {
        if (myArgs.length < 4) {
          console.log(
            "Error: please use the following syntax: \nnode bkbrewery token --search e [email]"
          );
        } else {
          if (DEBUG) console.log("--search e");
          searchToken(myArgs[3], "email");
        }
        break;
      } else {
        if (myArgs.length < 4) {
          console.log(
            "Error: please use the following syntax: \nnode bkbrewery token --search p [phone]"
          );
        } else {
          if (DEBUG) console.log("--search p");
          searchToken(myArgs[3], "phone");
        }
        break;
      }

    case "--help":
    case "--h":
    default:
      fs.readFile(__dirname + "/usage.txt", (error, data) => {
        if (error) throw error;
        console.log();
        console.log(data.toString());
        console.log();
      });
  }
}

// Exporting functions and variables for use in other modules
module.exports = {
  tokenApp,
  newWebToken,
  isValidEmail,
  isValidPhone,
};
