
const express = require('express');
const main = require("../controllers/main.controller");
const router = express.Router();

router.get('/central', main.getCentral1)
router.get('/college', main.getCollege1)
router.get('/major', main.getMajor1)
router.get('/all', main.getMain )
router.get('/search', main.getSearchCategory)
router.get('/election', main.getElection)
router.get('/banner', main.getBanner)
router.get('/calendar', main.getCalendar)

module.exports = router;