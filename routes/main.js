
const express = require('express');
const index = require("../controllers/main.controller");
const router = express.Router();


router.get('/central-organization', index.getCentral)
router.get('/college', index.getCollege)
router.get('/major', index.getMajor)
router.get('/search', index.getSearchCategory)

module.exports = router;