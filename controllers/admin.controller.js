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

module.exports = {registerCategory}