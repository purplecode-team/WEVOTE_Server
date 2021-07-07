const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User')

module.exports = () => {
    passport.use(new LocalStrategy( {
        usernameField: 'userId',
        passwordField: 'password',
    }, async (userId, password, done) => {
        try {
            const exUser = await User.findOne({where:{ userId }});
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, {message: '비밀번호 오류입니다.'});
                }
            } else {
                done(null, false, {message: '미가입 회원입니다.'});
            }
        } catch(e) {
            console.error(e);
            done(e);
        }
    }));
};