const express = require('express');
const promise = require("../controllers/promise.controller");
const router = express.Router();


router.get('/promise-detail', promise.getCentral)


module.exports = router;