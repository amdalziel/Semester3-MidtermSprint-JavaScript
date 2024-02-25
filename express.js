const path = require('path'); 
const fs = require('fs'); 

const crc32 = require('crc/crc32');
const { format } = require('date-fns');


const express = require('express'); 
const bodyParser = require('body-parser'); 
const app = express(); 

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

    let formatPhone = newTokenData.phone.replace(/-/g, "");
  
    newToken.created = `${format(now, 'yyyy-MM-dd HH:mm:ss')}`;
    newToken.username = newTokenData.username;
    newToken.email = newTokenData.email; 
    newToken.phone = formatPhone; 
    newToken.token = crc32(newTokenData.username).toString(16);
    newToken.expires = `${format(expires, 'yyyy-MM-dd HH:mm:ss')}`;
  
    if(DEBUG) console.log(newToken); 

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      }

      fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if(error) {
            res.render('failMess.ejs'); 
            throw error; }
        let tokens = JSON.parse(data);
        tokens.push(newToken);
        userTokens = JSON.stringify(tokens);
    
        fs.writeFile(__dirname + '/json/tokens.json', userTokens, (err) => {
            if (err) {
                res.render('failMess.ejs'); 
                console.log(err);}
            else { 
                console.log(`New token ${newToken.token} was created for ${newToken.username}.`);
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