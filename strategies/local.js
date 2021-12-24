const LocalStrategy = require('passport-local');
const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcryptjs');


passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if (err) done(err) 
        if (!user) done(null, false);
        done(null, user);
    })
})

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({username: username}, (err, user) => {
        if (err) return done(err) 
        if (!user) return done(null, false);

        bcrypt.compare(password, user.password, (err, data) => {
            if (err) return done(null, false);
            if (!data) return done(null, false);
            return done(null, user);
        })
    })
}))