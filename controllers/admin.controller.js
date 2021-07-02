const fs = require('fs');
const path = require('path');
const model = require("../models");

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'})

const s3 = new aws.S3({
    accessKeyId: process.env.KEY_ID,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION
});

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

const postCalendarDB = async(file) => {
    try {
        console.log(file);
        const {url} = file.key;
        if (url !== "") {
            const oldCalendar = await model.Calendar.findOne({where: {url}})
            await deleteCalendar(oldCalendar)
        }
        const calendarImg = file;
        await model.Calendar.create({image: calendarImg.location});
        return res.json({"imageUrl": calendarImg.location, "success": true});
    } catch (e) {
        console.log(e);
    }
}


const registerCalendar = async(req, res) => {
    try {
        //await checkFolder();
        uploadCalendar.single('img')(req, res, () => {
            console.log(req.file);

            const url = req.file.location;
            if (url !== "") {
                const oldCalendar = model.Calendar.findOne({where: {image:url}})
                deleteCalendar(oldCalendar)
            }
            const calendarImg = req.file;
            model.Calendar.create({image: calendarImg.location});
            res.json({'success': true});
            }
        )
    } catch(e) {
        console.error('업로드 오류')
    }
}

const registerInfo = async(req, res) => {
    try {
        //await checkInfoFolder();
        uploadInfo.array('img', 10)(req, res, () => {
            console.log(req.files);
            res.json({'success': true});
            }
        )
    } catch(e) {
        console.error('업로드 오류')
    }
}

/*
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
*/

const uploadCalendar = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'gpbucket-bomi/calendar',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read-write',
        key: function(req, file, cb) {
            let extension = path.extname(file.originalname);
            cb(null, Date.now().toString() + extension)
        }
    })
});

const uploadInfo = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'gpbucket-bomi/info',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read-write',
        key: function(req, file, cb) {
            let extension = path.extname(file.originalname);
            cb(null, Date.now().toString() + extension)
        }
    })
});

const postCalendar = async(req, res, next) => {
    try {
        console.log(req.file);
        const {url} = req.file.key;
        if (url !== "") {
            const oldCalendar = await model.Calendar.findOne({where: {url}})
            await deleteCalendar(oldCalendar)
        }
        const calendarImg = req.body;
        await model.Calendar.create({image: calendarImg.location});
        return res.json({"imageUrl": calendarImg.location, "success": true});
    } catch (e) {
        console.log(e);
    }
}

// calendar 작성 후 추가
const postInfo = async(req, res, next) => {
    try {
        return res.json({"success": true});
    } catch (e) {
        console.log(e);
    }
}

// 이미지 삭제
const deleteCalendar = async(calendar) => {
    const oldCalendar = calendar.url
    const image = await model.Calendar.findOne({where: {oldCalendar}})
    const url = image.url.split('/');
    const delImage = url[url.length - 1]
    const params = {
        Bucket: 'gpbucket-bomi',
        Key: delImage
    }
    s3.deleteObject(params, function(err, data) {
        if (err) {
            console.log("aws image delete error")
        } else {
            console.log("aws image delete success")
        }
    })
}

module.exports = {registerCategory, registerBanner, registerCalendar, registerInfo, postCalendar}