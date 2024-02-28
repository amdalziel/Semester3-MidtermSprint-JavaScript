const path = require('path'); 
const fs = require('fs'); 


const express = require('express'); 
const bodyParser = require('body-parser'); 
const app = express(); 

const { newWebToken } = require('./token');


const logEvents = require('./logEvents');
const EventEmitter = require('events');

const myEmitter = new EventEmitter();

myEmitter.on('logs', (event, level, msg) => logEvents(event, level, msg));


// Body Parser Middleware 
var jsonParser = bodyParser.json(); 
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const port = 3000; 

global.DEBUG = true; 




app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'public', 'views'));

app.use(express.static('public'));
app.use(express.json());

app.get("/", (req, res) => {
    if(DEBUG) console.log("Route: root"); 
    res.render('home.ejs'); 
})


// Route for saving tokens from browser (POST request)
app.post('/api/storeToken', urlencodedParser, (req, res) => {
    const newTokenData = req.body; 
    if(DEBUG) console.log(newTokenData); 

    let newToken = newWebToken(newTokenData.username, newTokenData.email, newTokenData.phone); 


    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if(error) {
            myEmitter.emit('logs', 'newWebToken()', 'INFO', `Error reading tokens.json: ${error}`);
            res.render('failMess.ejs'); 
            return }
        let tokens = JSON.parse(data);
        tokens.push(newToken);
        userTokens = JSON.stringify(tokens, null, 2);
    
        fs.writeFile(__dirname + '/json/tokens.json', userTokens, (err) => {
            if (err) {
                myEmitter.emit('logs', 'newWebToken()', 'INFO', `Error writing a token from the browser to file: ${err}.`);
                res.render('failMess.ejs'); 
                console.log(err);
            return }
            else { 
                console.log(); 
                console.log("** Success **"); 
                console.log(`New token ${newToken.token} was created for ${newToken.username}.`);
                console.log(); 
                myEmitter.emit('logs', 'newWebToken()', 'INFO', `New token ${newToken.token} was created for ${newToken.username}.`);
                res.render('successMess.ejs', {tok: newToken.token});
            }
        })
    }); 
       
});


app.use((request, response) => {
    response.status(404).write('404: Content not found'); 
    response.end(); 
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`); 
})