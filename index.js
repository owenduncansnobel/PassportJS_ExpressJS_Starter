const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo');


const authRoute = require('./routes/auth');
const registerRoute = require('./routes/register');

const app = express();

require('dotenv').config()
const url = process.env.URL;
const SECRET = process.env.SECRET;

mongoose.connect(url + 'users', {
    useNewUrlParser: true,
});

const db = mongoose.connection;

db.once('open', _ => {
    console.log('Database connected:', url)
})

db.on('error', err => {
    console.error('connection error:', err)
})

// * Middleware 
app.use(express.json());
app.use(express.urlencoded());

app.use(session({
    secret: SECRET,
    resave: true,
    store: MongoStore.create({mongoUrl: url + 'sessions'}),
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/register', registerRoute);
app.use('/auth', authRoute);

function isLoggedIn(req, res, done) {   
    if (req.user) {
    return done();
 }
 return res.redirect("/login");
};

app.get('/protected', isLoggedIn, async (req, res) => {
    if (req.user){
        res.json({message: 'protected route :)'})
    } else {
        res.json({message: 'not authenticated'})
    }
})

app.listen(4999, () => {
    console.log("Server has started!");
})