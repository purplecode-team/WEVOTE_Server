const express = require('express');
const admin = require("../controllers/admin.controller");
const router = express.Router();


router.post('/category', admin.registerCategory)
router.post('/banner', admin.registerBanner)
router.delete('/banner/:id', admin.deleteBanner)
router.patch('/banner/:id', admin.updateBanner)

module.exports = router;