const model = require("../models")
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const postJoin = async (req, res, next) => {
    const {userId, nickName, password, status} = req.body;
    try {
        const exUser = await model.User.findOne({where: {userId}});
        if (exUser) {
            return res.status(400).json({success: false, message: '이미 존재하는 아이디입니다.'});
        } else {
            const hash = await bcrypt.hash(password, 12);
            await model.User.create({
                userId,
                nickName,
                password: hash,
                status
            });
            return res.status(200).json({
                success: true,
                userId: userId,
                nickName: nickName,
                status: status,
                message: '아이디가 성공적으로 등록되었습니다.'});
        }
    } catch (e) {
        console.log("error!!");
        return next(e);
    }
}

const postLogin = (req, res, next) => {
    passport.authenticate('local', {session: false}, (authError, user, info) => {
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
            // jwt 토큰
            const token = jwt.sign({
                userId: user.userId,
                status: user.status,
            }, process.env.JWT_SECRET, {
                expiresIn: '1h',
                issuer: 'wevote',
            });

            // res.cookie('user', token);

            return res.status(200).json({
                success: true,
                userId: user.userId,
                nickName: user.nickName,
                status: user.status,
                message: '로그인에 성공하였습니다.',
                token
            })
        });
    }) (req, res, next);
}

/*
const getLogout = (req, res) => {
    try {
        req.decoded.token = "";
        return res.status(200).json({
            success: true,
            message: '로그아웃에 성공하였습니다.'
        })
    } catch(e) {
        return res.status(500).json({
            success: false,
            message: '로그아웃 실패'
        })
    }
}

// session 이용한 로그아웃
const getLogout = (req, res) => {
    req.logout();
    req.session.destroy((e) => {
        if (e) {
            console.log(e);
            return res.send('session is not destroy');
        } else {
            console.log('session destroy success');
            return res.send({message: '세션이 종료되었습니다. 다시 로그인 해주세요.'});
        }
    });
};
*/

module.exports = {postJoin, postLogin}