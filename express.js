const path = require('path'); 

const express = require('express'); 
const app = express(); 

const port = 3000; 

global.DEBUG = true; 




app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'public', 'views'));

app.use(express.static('public'));

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