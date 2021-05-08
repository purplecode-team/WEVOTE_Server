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
                    attributes: ["id", "promiseType", "promiseTitle", "promiseDetail"]
                },
                {
                    model: model.Qna,
                    attributes: ["id", "type", "comment", "time"]
                }
            ],
            where: {teamId: id}
        })

        return res.json(data);
    } catch (e) {
        console.log("error!!")
    }
}

module.exports={ getPromise };