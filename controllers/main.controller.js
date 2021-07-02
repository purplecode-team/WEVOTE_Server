const model = require("../models")
const Sequelize = require('sequelize');

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

const renameKeyOfObj = (object) => {

}

const renameKey = (object, key, newKey) => {
    return {'id': object['id'], [newKey]: object[key]}
};

const getSearchCategory = async (req, res, next) => {
    try {
        let centralResult = await model.Central.findAll();
        let collegeResult = await model.College.findAll();
        let majorResult = await model.Major.findAll({
            attributes: ['id', 'majorName']
        })

        centralResult = centralResult.map((res) =>
            renameKey(res['dataValues'], "centralName", "name")
        )
        collegeResult = collegeResult.map((res) => {
            return renameKey(res['dataValues'], "collegeName", "name")
        })
        majorResult = majorResult.map((res) => {
            return renameKey(res['dataValues'], "majorName", "name")
        })

        let result = collegeResult.concat(centralResult);
        result = result.concat(majorResult);

        return res.json(result);
    } catch (e) {
        console.log(e)
    }
}

const getBanner = async (req, res, next) => {
    try {
        const banner = await model.Banner.findOne({
                order: [['id', 'DESC']],
            }
        );

        return res.json(banner);
    } catch (e) {
        console.log(e);
    }
}

const getCalendar = async (req, res, next) => {
    try {
        const calendar = await model.Calendar.findOne({
                order: [['id', 'DESC']],
            }
        );

        return res.json(calendar);
    } catch (e) {
        console.log(e);
    }
}

const getElection = async (req, res, next) => {
    try {
        // const Op = Sequelize.Op;
        //
        // const data = await model.Team.findAll({
        //     raw: true,
        //
        //     attributes: [
        //         'centralId','categoryDetail', [Sequelize.fn('COUNT', 'centralId'), 'count'], [Sequelize.col('Schedules.startDate'), 'startDate']
        //     ],
        //     where: [{centralId: {[Op.ne]:null}}],
        //     //,{centralId: {[Op.eq]: 'Schedule.teamId'}}
        //     group: ['Team.centralId', 'Team.categoryDetail'],
        //     include: [
        //         {
        //             model: model.Schedule,
        //             attributes: [],
        //             required: true,
        //         }
        //     ],
        // })
        // console.log(data);
        //return res.json(data);
        //return res.json(getType(data));

        const { QueryTypes } = require('sequelize');

        //시작~끝날짜 있는 것
        // const query =
        //     "select Team.centralId, Team.categoryDetail, count(Team.centralId) as count, Schedule.startDate, Schedule.endDate from Team INNER JOIN Schedule WHERE Team.centralId = Schedule.centralId GROUP BY Team.centralId, Team.categoryDetail, Schedule.startDate, Schedule.endDate;"


        //시작~끝날짜 없는 것
        const query =
            "select Team.centralId, Team.categoryDetail, count(Team.centralId) as count from Team INNER JOIN Schedule WHERE Team.centralId = Schedule.centralId GROUP BY Team.centralId, Team.categoryDetail, Schedule.startDate, Schedule.endDate;"


        const results = await model.sequelize.query(query, { type: QueryTypes.SELECT });

        return res.json(getType(results));

    } catch (e) {
        console.log(e)
    }
}

const getType = (data) => {

    return data.map(
        (column) => {
            return {'id': column['centralId'], 'name': column['categoryDetail'], 'numOfTeam': column['count'],
                'type': (column['count']===1?"단선":"경선"), 'startDate': column['startDate'], 'endDate': column['endDate']};
        }
    )
}

const getMain = async (req, res, next) => {
    const a = {
        ...await getMajor(),
        ...await getCollege()
    }
    console.log(a);
    return res.json(a);
}


module.exports = {getMajor, getCollege, getCentral, getSearchCategory, getElection, getMain, getBanner, getCalendar}