const model = require("../models")
const Sequelize = require('sequelize');

const getPromise = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log(id);

        const data = await model.Team.findByPk(id,{
            include: [
                {
                    model: model.Runner
                },
                {
                    model: model.Promises,
                    attributes: ["id", "promiseType", "promiseOrder", "promiseDetail"]
                }
            ],
            where: {teamId: id}
        })

        /*const result2 = await model.College.findAll({
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
        })*/
        return res.json(data);
    } catch (e) {
        console.log("error!!")
    }
}

module.exports={getPromise};