const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/User');

module.exports = () => {
    passport.use(new KakaoStrategy ({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao',
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
            const exUser = await User.findOne({
                where: {snsId: profile.id, provider: 'kakao'},
            });
            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    email: profile._json && profile._json.kakao_account.email,
                    nickName: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser, {message: '가입 성공'});
            }
        } catch (e) {
            console.error(e);
            console.log('등록 실패!')
            done(e);
        }
    }));
};