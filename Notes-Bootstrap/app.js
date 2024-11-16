require('dotenv').config();

const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
// const session = require('session');
const path = require('path');



const app = express();
const port = 3000 || process.env.PORT;

var userRouter = require('./routes/user');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'))


app.use('/',userRouter);




app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`); 
})