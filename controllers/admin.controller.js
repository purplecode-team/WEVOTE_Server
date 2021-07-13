const Sequelize = require('sequelize');

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

const renameKey = (object, organization) => {
    return {'top': organization, 'middle': object}
};

//const renameMajorKey = (object, middleKey, bottomKey) => {
//    return {'top': '학과', ['middle']: object[middleKey], ['bottom']: object[bottomKey]}
//};

const getCategory = async (req,res,next) => {
    try {
        const central = [await getCentral()];
        const college = [await getCollege()];
        const major = [await getMajor()];
        return res.json(central.concat(college).concat(major));
    } catch(e) {
        console.log(e)
    }
}

const getCentral = async() => {
    try {
        const central = await model.Central.findAll({order: Sequelize.col('id')});
        console.log(JSON.stringify(central));
        return renameKey(central, '중앙자치기구');
    } catch(e) {
        console.log(e)
    }
}

const getCollege = async() => {
    try {
        const college = await model.College.findAll({order: Sequelize.col('id')});
        return renameKey(college, '단과대');
    } catch(e) {
        console.log(e)
    }
}

const getMajor = async() => {
    try {
        let major = await model.College.findAll({
            attributes: ['organizationName'],
            include: [
                {
                    model: model.Major,
                    attributes: ['id', 'organizationName'],
                    order: Sequelize.col('id')
                }
            ],
            order: Sequelize.col('id')
        });
        major = renameKey(major, '학과');
        //major = major.map((major =>
        //    renameMajorKey(major, "organizationName", "Majors")
        //));
        return major;
    } catch(e) {
        console.log(e)
    }
}

const registerCategory = async (req, res, next) => {
    try {
        if (req.body.top === '중앙자치기구') {
            await model.Central.create({
                organizationName: req.body.middle
            })
        } else if (req.body.top === '단과대') {
            await model.College.create({
                organizationName: req.body.middle
            })
        } else {
            await getCollegeId(req.body.middle, req.body.bottom);
        }
        return res.json({success: true});
    } catch(e) {
        console.log(e);
        return res.json({success: false});
    }
}

const getCollegeId = async (collegeName, majorName) => {
    const college = await model.College.findOne({
        where: {organizationName: collegeName}
    })
    await registerMajor(college.id, majorName)
}

const registerMajor = async(id, majorName) => {
    try {
        await model.Major.create({
            collegeId: id,
            organizationName: majorName
        })
    } catch (e) {
        console.log('registerMajor error');
    }
}

const deleteCentral = async(req, res, next) => {
    try {
        await model.Central.destroy({where: {id: req.params.id}})
        return res.json({"success": true})
    } catch (e) {
        console.log(e);
    }
}

const deleteCollege = async(req, res, next) => {
    try {
        await model.College.destroy({where: {id: req.params.id}})
        return res.json({"success": true})
    } catch (e) {
        console.log(e);
    }
}

const deleteMajor = async(req, res, next) => {
    try {
        await model.Major.destroy({where: {id: req.params.id}})
        return res.json({"success": true})
    } catch (e) {
        console.log(e);
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

        await model.Banner.destroy({where: {id: req.params.id}})

        return res.json({"success": true})

    } catch (e) {
        console.log(e);
    }
}

const updateBanner = async (req, res, next) => {
    try {
        const id = req.params.id;
        const newBannerData = req.body;

        await model.Banner.update(newBannerData, {where: {id: id}})

        return res.json({"success":true})

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
            console.log(req);
            const infoImgs = req.files;
            infoImgs.forEach(img => model.ElectionInfo.create({image: img.location}))
            //res.json({'success': true});
            res.json(infoImgs)
            }
        )
    } catch(e) {
        console.error('업로드 오류')
    }
}

const getInfoImgList = async(req, res) => {
    try {
        const data = await model.ElectionInfo.findAll();
        console.log(data);
        return res.json(data);
    }
    catch (e) {
        console.log(e)
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
const deleteCalendar = async(req, res, next) => {
    //s3 버킷 삭제하는 곳
    // const oldCalendar = req.params.id
    // const image = await model.Calendar.findOne(oldCalendar)
    // const url = image.url.split('/');
    // const delImage = url[url.length - 1]
    // const params = {
    //     bucket: 'gpbucket-bomi',
    //     key: delImage
    // }
    // s3.deleteObject(params, function(err, data) {
    //     if (err) {
    //         console.log("aws image delete error")
    //     } else {
    //         console.log("aws image delete success")
    //     }
    // })

    await model.Calendar.destroy({where: {id: req.params.id}})

    return res.json({"success": true})
}

const deleteInfoImg = async(req, res, next) => {
    const oldImg = await model.ElectionInfo.findOne({where: {id: req.params.id}})

    const url = oldImg.image.split('/');
    const delImage = url[url.length - 1]
    console.log(delImage)
    const key = 'info/'+delImage;
    console.log(key)
    const params = {
        Bucket: 'gpbucket-bomi',
        Key: key
    }
    // s3 속에 객체까지 지우는 코드 (현재 에러나서 보류)
    // s3.deleteObject(params, function(err, data) {
    //     if (err) {
    //         console.log(err)
    //         console.log("aws image delete error")
    //         return res.json({"success":false})
    //     } else {
    //         model.ElectionInfo.destroy({where: {id: req.params.id}})
    //         console.log("aws image delete success")
    //         return res.json({"success": true})
    //     }
    // })

    await model.ElectionInfo.destroy({where: {id: req.params.id}})

    return res.json({"success": true})
}


const registerCandidate = async(req, res, next) => {
    try {
        const candidate = req.body;
        console.log(candidate);

        const teamData = candidate.Teams + candidate.organizationName

        console.log(teamData);

        await model.Team.create(teamData);

        return res.json({"success": true});

    } catch (e) {
        console.log(e);
    }
}

module.exports = {getCategory, registerCategory, deleteCentral, deleteCollege, deleteMajor, registerBanner,  deleteBanner, updateBanner, registerCalendar, deleteCalendar, registerInfo, postCalendar, getInfoImgList, deleteInfoImg, registerCandidate}
