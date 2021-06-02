const express = require('express');
const admin = require("../controllers/admin.controller");
const router = express.Router();


router.post('/register-category', admin.registerCategory)
router.post('/register-banner', admin.registerBanner)
module.exports = router;