const multer = require('multer');
const fs = require('fs');
const path = require('path');
const model = require("../models");

const registerCategory = async (req, res, next) => {
    for (let i = 0; i < req.body.length; i++) {
        if (req.body[i].top === '중앙자치기구') {
            await registerCentral(req.body[i].middle)
        } else if (req.body[i].top === '단과대') {
            await registerCollege(req.body[i].middle)
        } else {
            await getMajorId(req.body[i].bottom)
        }
    }
    res.send('success');
}

const registerCentral = async(central) => {
    try {
        for (let j = 0; j < central.length; j++) {
            const {id, organization} = central[j]
            await model.Central.create({
                id: id,
                centralName: organization
            })
        }
    } catch (e) {
        console.log('registerCentral error');
    }
}

const registerCollege = async(college) => {
    try {
        for (let j = 0; j < college.length; j++) {
            const {id, organization} = college[j]
            await model.College.create({
                id: id,
                collegeName: organization
            })
        }
    } catch (e) {
        console.log('registerCollege error');
    }
}

const getMajorId = async(majorSet) => {
    try {
        for (let j = 0; j < majorSet.length; j++) {
            const {id} = majorSet[j]
            await registerMajor(id, majorSet[j].major)

        }
    } catch (e) {
        console.log('registerMajor error');
    }
}

const registerMajor = async(id, majorList) => {
    try {
        for (let k = 0; k < majorList.length; k++) {
            const major = majorList[k]
            await model.Major.create({
                collegeId: id,
                majorName: major
            })
        }
    } catch (e) {
        console.log('registerCollege error');
    }
}

const registerBanner = async(req, res, next) => {
    try {
        const bannerData = req.body;
        console.log(bannerData);

        await model.Banner.create(bannerData);

        return res.json({"success": true});

    } catch (e) {
        console.log(e);
    }
}

const deleteBanner = async(req, res, next) => {
    try {
        const id = req.params.id;

    } catch (e) {
        console.log(e);
    }
}

const registerCalendar = async(req, res) => {
    try {
        await checkFolder();
        uploadCalendar.single('img')(req, res, () => {
            console.log(req.file);
            res.json({url:`/register-calendar/${req.file.filename}`});
            }
        )
    } catch(e) {
        console.error('업로드 오류')
    }
}

const registerInfo = async(req, res) => {
    try {
        await checkInfoFolder();
        uploadInfo.single('img')(req, res, () => {
            console.log(req.file);
            res.json({url:`/register-info/${req.file.filename}`});
            }
        )
    } catch(e) {
        console.error('업로드 오류')
    }
}

const checkFolder = async() => {
    try {
        fs.readdirSync('uploadCalendar');
    } catch(e) {
        console.error('uploadCalendar 폴더가 없어 새로 생성')
        fs.mkdirSync('uploadCalendar');
    }
}

const checkInfoFolder = async() => {
    try {
        fs.readdirSync('uploadInfo');
    } catch(e) {
        console.error('uploadInfo 폴더가 없어 새로 생성')
        fs.mkdirSync('uploadInfo');
    }
}

const uploadCalendar = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploadCalendar/')
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: {fileSize: 5*1024*1024}
});

const uploadInfo = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploadInfo/')
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: {fileSize: 5*1024*1024}
});

module.exports = {registerCategory, registerBanner, registerCalendar, registerInfo}