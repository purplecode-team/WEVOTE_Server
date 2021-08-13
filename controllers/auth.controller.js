const model = require("../models")
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const request = require('request');

const localJoin = async (req, res, next) => {
    const {userId, password, nickName, status} = req.body;
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

const localLogin = (req, res, next) => {
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
                id: user.id,
                userId: user.userId,
                nickName: user.nickName,
                status: user.status,
            }, process.env.JWT_SECRET, {
                expiresIn: '1h',
                issuer: 'wevote',
            });

            // res.cookie('user', token);

            return res.status(200)
                .header({'Authorization': token})
                .json({
                userId: user.userId,
                nickName: user.nickName,
                status: user.status,
            })
        });
    }) (req, res, next);
}

const kakaoLogin = async (req, res, next) => {
    await request({
        method: "GET",
        headers: {'Authorization': "Bearer " + req.headers.authorization},
        uri: 'https://kapi.kakao.com/v2/user/me'
    }, async function (error, response, body) {
        if (error) {
            res.status(504).json({success: false, message: '카카오 access-token 인증 오류'})
        }
        else {
            try {
                const profile = JSON.parse(body);
                //console.log('카카오 인증 완료')
                const exUser = await model.User.findOne({
                    where: {snsId: profile.id, provider: 'kakao'},
                });
                if (!exUser) {
                    await model.User.create({
                        userId: profile.kakao_account.email,
                        nickName: profile.kakao_account.profile.nickname,
                        snsId: profile.id,
                        provider: 'kakao',
                    });
                }
                //console.log('등록 완료')
                const token = jwt.sign({
                    id: profile.id,
                    userId: profile.kakao_account.email,
                    nickName: profile.kakao_account.profile.nickname,
                    status: 'local',
                }, process.env.JWT_SECRET, {
                    expiresIn: '1h',
                    issuer: 'wevote',
                });
                //console.log('토큰 발급 및 리턴 완료')
                return res.status(200)
                    .header({'Authorization': token})
                    .json({
                    userId: profile.kakao_account.email,
                    nickName: profile.kakao_account.profile.nickname,
                    status: 'user',
                })
            } catch (e) {
                res.status(505).json({success: false, message: '서버 등록 오류'})
            }
        }
    })
}

const deleteUser = async(req, res, next) => {
    try {
        const id = req.params.id;
        const delUser = await model.User.findOne({where: {id}});
        if (!delUser) return res.status(404).json({success: false, message: '해당 userId가 등록되어있지 않습니다.'})
        await model.User.destroy({where: {id: id}})
        return res.json({success: true, message: '정상적으로 탈퇴되었습니다.'})
    } catch (e) {
        console.log(e);
        return res.status(505).json({success: false, message: '탈퇴 오류 발생'})
    }
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

module.exports = {localJoin, localLogin, kakaoLogin, deleteUser}