const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/User');

module.exports = () => {
    passport.use(new googleStrategy ({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: '/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('google profile', profile);
        try {
            const exUser = await User.findOne({
                where: {snsId: profile.id, provider: 'google'},
            });
            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    userId: profile._json.email,
                    nickName: profile.displayName,
                    snsId: profile.id,
                    provider: 'google'
                });
                done(null, newUser);
            }
        } catch (e) {
            console.error(e);
            done(e);
        }
    }));
};