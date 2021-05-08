const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const user = require("../controllers/auth.controller")
const router = express.Router();


router.post('/join', isNotLoggedIn, user.postJoin);
router.post('/login', isNotLoggedIn, user.postLogin);
router.get('/logout', isLoggedIn, user.getLogout);

module.exports = router;