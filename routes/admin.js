const express = require('express');
const admin = require("../controllers/admin.controller");
const router = express.Router();


router.post('/register-category', admin.registerCategory)
module.exports = router;