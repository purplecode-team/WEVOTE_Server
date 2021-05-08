const express = require('express');
const promise = require("../controllers/promise.controller");
const router = express.Router();


router.get('/promise-detail/:id', promise.getPromise)


module.exports = router;