const express = require('express');
const fs = require('fs');
const admin = require("../controllers/admin.controller");
const router = express.Router();

router.post('/register-category', admin.registerCategory);
router.post('/register-banner', admin.registerBanner);
router.post('/register-calendar', admin.registerCalendar);
router.post('/register-info', admin.registerInfo);
module.exports = router;