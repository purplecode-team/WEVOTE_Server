const express = require('express');
const admin = require("../controllers/admin.controller");
const router = express.Router();


router.post('/category', admin.registerCategory);
router.post('/banner', admin.registerBanner);
router.delete('/banner/:id', admin.deleteBanner);
router.patch('/banner/:id', admin.updateBanner);
router.post('/calendar', admin.registerCalendar);
router.delete('/calendar/:id', admin.deleteCalendar);
router.post('/info', admin.registerInfo);
router.get('/info', admin.getInfoImgList);
router.delete('/info/:id', admin.deleteInfoImg);
router.post('/central/candidate', admin.registerCandidate)
module.exports = router;