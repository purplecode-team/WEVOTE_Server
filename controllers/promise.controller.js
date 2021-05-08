const model = require("../models")
const Sequelize = require('sequelize');

const getPromise = async (req, res, next) => {
    try {
        const id = req.params.id;

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
        const { comment, teamId } = req.body;

        await model.Qna.create({
            teamId: teamId,
            comment: comment,
            type: "answer",
        })

        return res.status(200).json({success: true, message: '댓글 저장에 성공했습니다.'});

    } catch (e) {
        console.log(e)
        return res.status(500).json({success: false, message: e})
    }
}

module.exports={ getPromise, postPromiseQna };