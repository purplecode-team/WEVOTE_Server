const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const user = require("../controllers/auth.controller")
const router = express.Router();
const passport = require('passport')


router.post('/join', isNotLoggedIn, user.postJoin);
router.post('/login', isNotLoggedIn, user.postLogin);
router.get('/logout', isLoggedIn, user.getLogout);
router.get('/kakao', passport.authenticate('kakao'))
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/login',
}), (req, res) => {
    res.redirect('/');
});
router.get('/google', passport.authenticate('google'))
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;