
const fs = require('fs');
const path = require('path');

const crc32 = require('crc/crc32');
const { format } = require('date-fns');

const myArgs = process.argv.slice(2);

function tokenHelp() {
    if(DEBUG) console.log('token.tokenHelp()'); 
    fs.readFile(__dirname + "/usageToken.txt", (error, data) => {
        if(error) throw error;              
        console.log(data.toString());
    });
}

function tokenCount() {
    if(DEBUG) console.log('token.tokenCount()'); 
    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if(error) throw error; 
        let tokens = JSON.parse(data); 
        console.log("** Num of Tokens ** ")
        let numTokens = 0; 
        tokens.forEach(obj => {
            numTokens++; 
        })
        console.log(numTokens); 
    })
}


function newToken(username) {
  if(DEBUG) console.log('token.newToken()');
  let newToken = JSON.parse(`{
      "created": "2000-01-01 12:30:00",
      "username": "username",
      "email": "user@email.com",
      "phone": "2223334444",
      "token": "token",
      "expires": "2000-01-03 12:30:00",
      "confirmed": "tbd"
  }`);

  let now = new Date();
  let expires = addDays(now, 2);

  newToken.created = `${format(now, 'yyyy-MM-dd HH:mm:ss')}`;
  newToken.username = username;
  newToken.token = crc32(username).toString(16);
  newToken.expires = `${format(expires, 'yyyy-MM-dd HH:mm:ss')}`;

  fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
      if(error) throw error; 
      let tokens = JSON.parse(data);
      tokens.push(newToken);
      userTokens = JSON.stringify(tokens);
  
      fs.writeFile(__dirname + '/json/tokens.json', userTokens, (err) => {
          if (err) console.log(err);
          else { 
              console.log(`New token ${newToken.token} was created for ${username}.`);
          }
      })
      
  });
  return newToken.token;
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}


function updateToken(usrName, changeValue, type) {
    if(DEBUG) console.log('token.updateToken()');
    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if(error) throw error; 
        let tokens = JSON.parse(data); 
        tokens.forEach(obj => {
            if(obj.username === usrName) {
                obj[type] = changeValue; 
            }
        }); 
        let selectedToken = tokens.find(obj => {
            return obj.username === usrName; 
        }); 
         

        userTokens = JSON.stringify(tokens);
        fs.writeFile(__dirname + '/json/tokens.json', userTokens, (err) => {
            if (err) console.log(err);
            else { 
                console.log(`Updated token: ${JSON.stringify(selectedToken)}`);
            }
        });
     
});

}; 



function searchToken(value, type) {
if(DEBUG) console.log('token.searchToken()'); 

fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
    if(error) throw error; 
    let tokens = JSON.parse(data);
   
    let selectToken= null;   
    tokens.forEach(token => {
        if (token[type] === value) {
            if(DEBUG) {console.log(token)}; 
            selectToken = token.token; 
        }
    })

    if(selectToken == null) {
        console.log("Error: token username not found."); 
    } else {
        console.log(`** User Token ** \n${selectToken}`); 
    }
    
});
}



function tokenApp() {
  if(DEBUG) console.log('tokenApp()');

  switch (myArgs[1]) {
    case '--help':
    if(DEBUG) console.log('--help');
        tokenHelp(); 
        break;
    case '--count':
    if(DEBUG) console.log('--count');
     tokenCount();
      break;
    case '--new':
      if (myArgs.length < 3) {
          console.log('invalid syntax. node bkbrewery token --new [username]')
      } else {
        if(DEBUG) console.log('--new');
        newToken(myArgs[2]);
      }
      break;
    case '--upd':
    if(DEBUG) console.log('--upd');
    if(myArgs[2] != 'p' && myArgs[2] != 'e') {
        console.log('Error: please enter a valid command.')
        return; 
    }
    if (myArgs[2] === 'p'){
        if (myArgs.length < 5) {
            console.log('Error: please use the following syntax: \nnode bkbrewery token --upd p [username] [phone]')
        } else {
            if(DEBUG) console.log('--upd p'); 
            updateToken(myArgs[3], myArgs[4], 'phone'); 
        }
        break;
    } else {
        if (myArgs.length < 5) {
            console.log('Error: please use the following syntax: \nnode bkbrewery token --upd e [username] [email]')
        } else {
            if(DEBUG) console.log('--upd e'); 
            updateToken(myArgs[3], myArgs[4], 'email'); 
        }
        break;
    }
    case '--search':
        if(DEBUG) console.log('--search');
        if(myArgs[2] != 'u' && myArgs[2] != 'e' && myArgs[2] != 'p') {
            console.log('Error: please enter a valid command.')
            return; 
        }
        if(myArgs[2] === 'u'){
            if (myArgs.length < 4) {
                console.log('Error: please use the following syntax: \nnode bkbrewery token --search u [username]')
            } else {
                if(DEBUG) console.log('--search u'); 
                searchToken(myArgs[3], 'username'); 
            }
            break;
        } 
        if(myArgs[2] === 'e') {
            if (myArgs.length < 4) {
                console.log('Error: please use the following syntax: \nnode bkbrewery token --search e [email]')
            } else {
                if(DEBUG) console.log('--search e'); 
                searchToken(myArgs[3], 'email'); 
            }
            break;
        }
        else {
            if (myArgs.length < 4) {
                console.log('Error: please use the following syntax: \nnode bkbrewery token --search p [phone]')
            } else {
                if(DEBUG) console.log('--search p'); 
                searchToken(myArgs[3], 'phone'); 
            }
            break;
        }
    
  case '--help':
  case '--h':
  default:
      fs.readFile(__dirname + "/usage.txt", (error, data) => {
          if(error) throw error;              
          console.log(data.toString());
      });
  }
}

module.exports = {
  tokenApp,
}