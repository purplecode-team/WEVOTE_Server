const model = require("../models")
const passport = require('passport');
const bcrypt = require('bcrypt');

const postJoin = async (req, res, next) => {
    const {userId, password, status} = req.body;
    try {
        const exUser = await model.User.findOne({where: {userId}});
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await model.User.create({
            userId,
            password: hash,
            status
        });
        res.send('Successfully Join...');
    } catch (e) {
        console.log("error!!");
        return next(e);
    }
}

const postLogin = (req, res, next) => {
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
            return res.send('Successfully Login...');
        });
    }) (req, res, next);
}

const getLogout = (req, res) => {
    req.logout();
    req.session.destroy((e) => {
        if (e) {
            console.log(e);
            return res.send('session is not destroy');
        } else {
            console.log('session destroy success');
            return res.send('session is destroy (login please)');
        }
    });
};

module.exports = {postJoin, postLogin, getLogout}