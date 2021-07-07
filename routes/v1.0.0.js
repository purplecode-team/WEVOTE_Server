const express = require('express');
const v1 = require("../controllers/v1.controller");
const router = express.Router();
const { verifyToken } = require('./middlewares');

router.post('/token', v1.issueLoginToken);
router.get('/checkLogin', verifyToken, (req, res) => {
    res.json(req.decoded);
});

module.exports = router;