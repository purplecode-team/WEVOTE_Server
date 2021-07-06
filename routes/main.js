
const express = require('express');
const main = require("../controllers/main.controller");
const router = express.Router();


router.get('/central-organization', main.getCentral)
router.get('/college', main.getCollege)
router.get('/department', main.getMajor)
router.get('/search', main.getSearchCategory)
router.get('/election', main.getElection)
router.get('/main', main.getMain)
router.get('/banner', main.getBanner)
router.get('/calendar', main.getCalendar)

module.exports = router;