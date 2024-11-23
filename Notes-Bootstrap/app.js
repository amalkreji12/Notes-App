require('dotenv').config();
const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./controller/connection');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');


const app = express();
const port = 3000 || process.env.PORT;

db.connect();

var userRouter = require('./routes/user');
var authRouter = require('./routes/auth');
const { Mongoose } = require('mongoose');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'))
app.use(session({
    secret:'key',
    saveUninitialized:true,
    resave:false,
    store:MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/',userRouter);
app.use('/',authRouter);


app.get('*',(req,res)=>{
    res.status(404).send('404 Not Found.');
})

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`); 
})