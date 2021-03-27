const model = require("../models")

const getMajor = async (req, res, next) => {
    try {
        const result2 = await model.College.findAll({
            include: [
                {
                    model: model.Major,
                    attributes: ['id', 'majorName'],
                    include: [
                        {
                            model: model.Team,
                            attributes: ['id', 'order', 'slogan'],
                            include: [
                                {
                                    model: model.Runner,
                                    attributes: ['id', 'name', 'major', 'studentNum', 'position', 'picture', 'teamId']
                                }
                            ]
                        }
                    ]
                }
            ]
        })
        return res.json(result2);
    } catch (e) {
        console.log("error!!")
    }
}



const getCollege = async (req, res, next) => {
    try {
        const result2 = await model.College.findAll({
            include: [
                {
                    model: model.Team,
                    attributes: ['id', 'order', 'slogan'],
                    include: [
                        {
                            model: model.Runner,
                            attributes: ['id', 'name', 'major', 'studentNum', 'position', 'picture', 'teamId']
                        }
                    ]

                }
            ]
        })
        return res.json(result2);
    } catch (e) {
        console.log("error!!")
    }
}



const getCentral = async (req, res, next) => {
    try {
        const result2 = await model.Central.findAll({
            include: [
                {
                    model: model.Team,
                    attributes: ['id', 'order', 'slogan'],
                    include: [
                        {
                            model: model.Runner,
                            attributes: ['id', 'name', 'major', 'studentNum', 'position', 'picture', 'teamId']
                        }
                    ]

                }
            ]
        })
        return res.json(result2);
    } catch (e) {
        console.log("error!!")
    }
}

module.exports = {getMajor, getCollege, getCentral}