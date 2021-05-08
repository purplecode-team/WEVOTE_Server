const passport = require('passport');
const local = require('./localStrategy')
const User = require('../models/User');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.userId);
    });

    passport.deserializeUser((userId, done) => {
        User.findOne({where: { userId }})
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local();

};