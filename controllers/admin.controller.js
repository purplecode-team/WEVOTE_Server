const model = require("../models");

const registerCategory = async (req, res, next) => {
    try {
        if (req.body.top === '중앙자치기구') {
            await model.Central.create({
                centralName: req.body.middle
            })
        } else if (req.body.top === '단과대') {
            await model.College.create({
                CollegeName: req.body.middle
            })
        } else {
            await getCollegeId(req.body.middle, req.body.bottom);
        }
        return res.json({success: true})
    } catch(e) {
        return res.json({success: false})
    }
}

const getCollegeId = async (collegeName, majorName) => {
    const college = await model.College.findOne({
        where: {collegeName: collegeName}
    })
    await registerMajor(college.id, majorName)
}

const registerMajor = async(id, majorName) => {
    try {
        await model.Major.create({
            collegeId: id,
            majorName: majorName
        })
    } catch (e) {
        console.log('registerMajor error');
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


module.exports = {registerCategory, registerBanner}