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

const postPromiseQna = async(req, res, next) => {
    try {
        const { comment } = req.body;
        console.log(comment)

        await model.Qna.create({

            comment: comment,

        })

        return res.status(200).json({success: true, error: 'error'});

    } catch (e) {
        console.log(e)
    }
}

module.exports={ getPromise, postPromiseQna };