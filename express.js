const path = require('path'); 
const fs = require('fs'); 

const express = require('express'); 
const app = express(); 

const port = 3000; 

global.DEBUG = true; 




app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'public', 'views'));

app.use(express.static('public'));
app.use(express.json());

app.post('/api/storeToken', (req, res) => {
    const newTokenData = req.body; 
    console.log(newTokenData); 
    
    res.json({ success: true });

    fs.readFile(__dirname + '/json/tokens.json', 'utf-8', (error, data) => {
        if(error) throw error; 
        let tokens = JSON.parse(data);
        tokens.push(newTokenData);
        userTokens = JSON.stringify(tokens);
    
        fs.writeFile(__dirname + '/json/tokens.json', userTokens, (err) => {
            if (err) console.log(err);
            else { 
                console.log(`New token ${newTokenData.token} was created for ${newTokenData.username}.`);
            }
        });
});

}); 

app.get("/", (req, res) => {
    console.log("Route: root"); 
    res.render('home.ejs'); 
})

app.use((request, response) => {
    response.status(404).write('404: Content not found'); 
    response.end(); 
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`); 
})