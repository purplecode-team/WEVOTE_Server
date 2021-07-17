const express = require('express');
const admin = require("../controllers/admin.controller");
const router = express.Router();

router.get('/category', admin.getCategory);
router.post('/category', admin.registerCategory);
router.delete('/category/central/:id', admin.deleteCentral);
router.delete('/category/college/:id', admin.deleteMajorCollege);
router.delete('/category/major/:id', admin.deleteMajor);
router.post('/banner', admin.registerBanner);
router.delete('/banner/:id', admin.deleteBanner);
router.patch('/banner/:id', admin.updateBanner);
router.post('/calendar', admin.registerCalendar);
router.delete('/calendar/:id', admin.deleteCalendar);
router.post('/info', admin.registerInfo);
router.get('/info', admin.getInfoImgList);
router.delete('/info/:id', admin.deleteInfoImg);
router.get('/candidate/:id', admin.getCandidate);
router.post('/candidate', admin.registerCandidate);
router.patch('/candidate/:id', admin.updateCandidate);
router.delete('/candidate/:id', admin.deleteCandidate);


module.exports = router;