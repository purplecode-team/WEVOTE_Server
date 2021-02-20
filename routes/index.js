const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    console.log('http://localhost:8001/api')
    res.json([
        {id: 1, username: "VictorOladipo"},
        {id: 2, username: "RussellWestbrook"}
    ]);
})

module.exports = router;