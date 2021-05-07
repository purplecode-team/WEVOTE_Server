const model = require("../models")
const passport = require('passport');
const bcrypt = require('bcrypt');

const postJoin = async (req, res, next) => {
    const {userId, password} = req.body;
    try {
        const exUser = await model.User.findOne({where: {userId}});
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await model.User.create({
            userId,
            password: hash
        });
        return res.redirect('/');
    } catch (e) {
        console.log("error!!");
        return next(e);
    }
}

const postLogin = async (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        })
    }) (req, res, next);
}

module.exports = {postJoin, postLogin}