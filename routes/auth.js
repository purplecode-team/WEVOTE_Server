const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const user = require("../controllers/auth.controller")
const router = express.Router();
const passport = require('passport')

router.post('/join', isNotLoggedIn, user.localJoin);
// router.post('/join', user.postJoin);
router.post('/login', isNotLoggedIn, user.localLogin);
router.get('/kakao', user.kakaoLogin);
// router.post('/logout', isLoggedIn, user.getLogout);
router.delete('/withdrawal/:id', user.deleteUser);

module.exports = router;