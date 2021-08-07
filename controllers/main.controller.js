const model = require("../models")
const Sequelize = require('sequelize');

function renameKeys(obj, newKeys) {
    const keyValues = Object.keys(obj).map(key => {
        const newKey = newKeys[key] || key;
        return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
}

const getMajor = async (req, res, next) => {
    try {
        let result2 = await model.College.findAll({
            //raw: true,
            include: [
                {
                    model: model.Major,
                    attributes: ['id', 'organizationName'],
                    include: [
                        {
                            model: model.Team,
                            attributes: ['id', 'order', 'slogan'],
                            include: [
                                {
                                    model: model.Runner,
                                    attributes: ['id', 'name', 'major', 'studentNum', 'position', 'picture', 'teamId']
                                }
                            ],
                            order: [['id', 'ASC']]
                        }
                    ],
                    order: [['id', 'ASC']]
                }
            ],
            order: [['id', 'ASC']]
        })

        result2 = result2.map(el => el.get({ plain: true }));



        // result2.prototype.renameProperty = function (oldName, newName) {
        //     // Do nothing if the names are the same
        //     if (oldName === newName) {
        //         return this;
        //     }
        //     // Check for the old property name to avoid a ReferenceError in strict mode.
        //     if (this.hasOwnProperty(oldName)) {
        //         this[newName] = this[oldName];
        //         delete this[oldName];
        //     }
        //     return this;
        // };
        // renameProperty("collegeName", "name");

        //
        // const result = result2.map((res) => {
        //     return renameKey(res['dataValues'], "majorName", "name")
        // })
        //
        // console.log(result)

        return result2;
        //return res.json(result2);
    } catch (e) {
        console.log(e)
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
            ],
            order: [['id', 'ASC']]
        })
        return result2;
        //return res.json(result2);
    } catch (e) {
        console.log(e)
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
            ],
            order: [['id', 'ASC']]
        })
        console.log(result2);
        return result2;
        //return res.json(result2);
    } catch (e) {
        console.log(e)
    }
}

const getMain = async(req, res, next) => {
    try {
        const data = {
            "central": await getCentral(),
            "college": await getCollege(),
            "major": await getMajor()
        }

        return res.json(data);

    } catch (e) {
        console.log(e);
    }
}

const getCentral1 = async(req, res, next) => {
    try {
        const data = await getCentral();
        return res.json(data);
    } catch (e) {
        console.log(e);
    }
}

const getCollege1 = async(req, res, next) => {
    try {
        const data = await getCollege();
        return res.json(data);
    } catch (e) {
        console.log(e);
    }
}

const getMajor1 = async(req, res, next) => {
    try {
        const data = await getMajor();
        return res.json(data);
    } catch (e) {
        console.log(e);
    }
}

const renameKey = (object, key, newKey) => {
    return {'id': object['id'], [newKey]: object[key]}
};

const getSearchCategory = async (req, res, next) => {
    try {
        let centralResult = await model.Central.findAll({order: [['id', 'ASC']]});
        let collegeResult = await model.College.findAll({order: [['id', 'ASC']]});
        let majorResult = await model.Major.findAll({
            attributes: ['id', 'organizationName'],
            order: [['id', 'ASC']]
        })

        centralResult = centralResult.map((res) =>
            renameKey(res['dataValues'], "organizationName", "name")
        )
        collegeResult = collegeResult.map((res) => {
            return renameKey(res['dataValues'], "organizationName", "name")
        })
        majorResult = majorResult.map((res) => {
            return renameKey(res['dataValues'], "organizationName", "name")
        })

        let result = centralResult.concat(collegeResult);
        result = result.concat(majorResult);

        return res.json(result);
    } catch (e) {
        console.log(e)
    }
}

//가장 후에 등록된 배너 불러오
const getLastBanner = async (req, res, next) => {
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

const getBanner = async (req, res, next) => {
    try {
        const banner = await model.Banner.findAll({order: [['id', 'ASC']]});

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
            "select Team.centralId, Team.categoryDetail, count(Team.centralId) as count from Team WHERE Team.centralId is not NULL GROUP BY Team.centralId, Team.categoryDetail;"


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


module.exports = {getMajor1, getCollege1, getCentral1, getSearchCategory, getElection, getBanner, getCalendar, getMain}