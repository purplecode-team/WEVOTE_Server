const moment = require('moment');

const Sequelize = require('sequelize');

const fs = require('fs');
const path = require('path');
const model = require("../models");

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'})

global.atob = require("atob");
global.Blob = require('node-blob');
const File = require('File');

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
        if (central || college || major) {
            return res.status(501);
        } else {
            return res.json(central.concat(college).concat(major));
        }
    } catch(e) {
        console.log(e)
        return res.status(501).json({success: false, message: "카테고리 호출 서버 오류"});
    }
}

const getCentral = async(next) => {
    try {
        const central = await model.Central.findAll({order: Sequelize.col('id')});
        console.log(JSON.stringify(central));
        return renameKey(central, '중앙자치기구');
    } catch(e) {
        console.log(e);
        next.error;
    }
}

const getCollege = async(next) => {
    try {
        const college = await model.College.findAll({order: Sequelize.col('id')});
        return renameKey(college, '단과대');
    } catch(e) {
        console.log(e);
        next.error;
    }
}

const getMajor = async(next) => {
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
        next.error;
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
        return res.status(501).json({success: false, message: "카테고리 등록 오류"});
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
        return res.status(402).json({success: false, message: "삭제 오류: id가 존재하지 않음"});
    }
}

const deleteMajorCollege = async(req, res, next) => {
    try {
        await model.Major.destroy({where: {collegeId: req.params.id}})
        await deleteCollege(req, res, next);
    } catch (e) {
        return res.status(402).json({success: false, message: "삭제 오류: id가 존재하지 않음"});
    }
}

const deleteCollege = async(req, res, next) => {
    try {
        await model.College.destroy({where: {id: req.params.id}})
        return res.status(200).json({"success": true});
    } catch (e) {
        console.log(e);
        return res.status(402).json({success: false, message: "삭제 오류: id가 존재하지 않음"});
    }
}

const deleteMajor = async(req, res, next) => {
    try {
        await model.Major.destroy({where: {id: req.params.id}})
        return res.json({"success": true})
    } catch (e) {
        console.log(e);
        return res.status(402).json({success: false, message: "삭제 오류: id가 존재하지 않음"});
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
        return res.status(501).json({success: false, message: "배너 등록 오류"});
    }
}

const deleteBanner = async(req, res, next) => {
    try {
        await model.Banner.destroy({where: {id: req.params.id}})

        return res.json({"success": true})

    } catch (e) {
        console.log(e);
        return res.status(402).json({success: false, message: "삭제 오류: id가 존재하지 않음"});
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
        return res.status(501).json({success: false, message: "배너 수정 오류"});
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
        console.error(e)
        return res.status(501).json({success: false, message: "캘린더 등록 오류"});
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
        console.error(e)
        return res.status(501).json({success: false, message: "사진 등록 오류"});
    }
}

const getInfoImgList = async(req, res) => {
    try {
        const data = await model.ElectionInfo.findAll({order: [['id', 'ASC']]});
        console.log(data);
        return res.json(data);
    }
    catch (e) {
        console.log(e);
        return res.status(501).json({success: false, message: "사진 호출 오류"});
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
        return res.status(501).json({success: false, message: "캘린더 등록 오류"});
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

    try {
        await model.Calendar.destroy({where: {id: req.params.id}})
        return res.json({"success": true})
    } catch (e) {
        console.log(e);
        return res.status(402).json({success: false, message: "삭제 오류: id가 존재하지 않음"});
    }

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


const renameOrganizationId = (object, key, newKey) => {
    object[newKey] = object[key]
    delete object[key];
    return object;
};

const getCandidate = async(req, res, next) => {
    try {
        const data =  await model.Team.findOne({
            where: {id: req.params.id},
            include: [
                {
                    model: model.Runner,
                    // attributes: ['id', 'name', 'major', 'studentNum', 'position', 'picture', 'teamId']
                },
                {
                    model: model.Promises
                }
            ],order: [['id', 'ASC']]
        });

        const candidate = data['dataValues']

        let newCandidate

        if(candidate.categoryName === '중앙자치기구') {
            newCandidate = renameOrganizationId(candidate, "centralId", "organizationId")
            delete newCandidate["collegeId"];
            delete newCandidate["majorId"];
        }
        else if(candidate.categoryName === "단과대") {
            newCandidate = renameOrganizationId(candidate, "collegeId", "organizationId")
            delete newCandidate["centralId"];
            delete newCandidate["majorId"];
        }
        else if(candidate.categoryName === "학과") {
            newCandidate = renameOrganizationId(candidate, "majorId", "organizationId")
            delete newCandidate["collegeId"];
            delete newCandidate["centralId"];
        }
        else {
        }



        console.log(newCandidate);

        return res.json(newCandidate);
    }
    catch (e) {
        console.log(e);
        return res.status(501).json({success: false, message: "후보자 호출 오류"});
    }
}


function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');

    return response;
}

const registerCandidate = async(req, res, next) => {
    try {
        let candidate = req.body;
        let newCandidate;

        if(candidate.categoryName === '중앙자치기구') {
            const central = await model.Central.findOne( {where: {organizationName: candidate.categoryDetail}})
            candidate["centralId"] = central.id
        }
        else if(candidate.categoryName === "단과대") {
            const college = await model.College.findOne( {where: {organizationName: candidate.categoryDetail}})
            candidate["collegeId"] = college.id
        }
        else if(candidate.categoryName === "학과") {
            const major = await model.Major.findOne( {where: {organizationName: candidate.majorName}})
            console.log(major)
            candidate["majorId"] = major.id
        }
        else {
        }

        const AWS = require('aws-sdk');
        AWS.config.loadFromPath('s3_config.json');
        const s3 = new AWS.S3();


        candidate.Runners.forEach(it => {
            const format = it.picture.substring(it.picture.indexOf('data:')+5, it.picture.indexOf(';base64'));

            let imageBuffer = decodeBase64Image(it.picture);

            let fileName = moment.now().toString()+it.major+it.name+"image.jpg"

            s3.upload({
                Bucket:'gpbucket-bomi/candidate',
                Key: fileName,
                Body: imageBuffer.data,
                ContentEncoding:'base64',
                ContentType:format
            }, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
            });

            it.picture = "https://gpbucket-bomi.s3.ap-northeast-2.amazonaws.com/candidate/"+fileName;

        })


        await model.Team.create(candidate, {include : [model.Runner, model.Promises]});

        return res.json({"success": true});
    }
    catch (e) {
        console.log(e);
        return res.status(501).json({success: false, message: "후보자 등록 오류"});
    }
}

const updateCandidate = async(req, res, next) => {
    try {
        let candidate = req.body;
        console.log(candidate)
        let newCandidate;

        if(candidate.categoryName === '중앙자치기구') {
            newCandidate = renameOrganizationId(candidate, "organizationId", "centralId")
        }
        else if(candidate.categoryName === "단과대") {
            newCandidate = renameOrganizationId(candidate, "organizationId", "collegeId")
        }
        else if(candidate.categoryName === "학과") {
            newCandidate = renameOrganizationId(candidate, "organizationId", "majorId")
        }
        else {
        }
        await model.Team.update(newCandidate, { where: {id: req.params.id}});
        await newCandidate.Runners.forEach(it => {
            model.Runner.update(it, {where: {id: it.id}})
        })
        await newCandidate.Promises.forEach(it => {
            model.Promises.update(it, {where: {id: it.id}})
        })

        return res.json({"success": true});
    }
    catch (e) {
        console.log(e);
        return res.status(501).json({success: false, message: "후보자 수정 오류"});
    }
}

const deleteCandidate = async(req, res, next) => {
    try {
        await model.Team.destroy({where: {id: req.params.id}})
        await model.Runner.destroy({where: {teamId: null}})
        await model.Promises.destroy({where: {teamId: null}})

        return res.json({"success": true})
    }
    catch (e) {
        console.log(e);
        return res.status(501).json({success: false, message: "후보자 삭제 오류"});
    }
}

const getMajorList = async (req,res,next) => {
    try {
        const majorObj = await model.Major.findAll({
            attributes: ['organizationName'],
            order: Sequelize.col('collegeId')
        });
        const majorList = majorObj.map(major => major.organizationName);
        return res.status(200).json({'major': majorList});
    } catch(e) {
        console.log(e)
    }
}

module.exports = {getCategory, registerCategory, deleteCentral, deleteMajorCollege, deleteMajor, registerBanner,
    deleteBanner, updateBanner, registerCalendar, deleteCalendar, registerInfo, postCalendar, getInfoImgList, deleteInfoImg,
    getCandidate, registerCandidate, updateCandidate, deleteCandidate, getMajorList}
