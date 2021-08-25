const model = require("../models")
const Sequelize = require('sequelize');

const getPromise = async (req, res, next) => {
    try {
        //id => centralId, collegeId, majorId 셋중에 하나
        const id = req.params.id;

        let data = await model.Team.findAll({
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
            ],where: {majorId: id}, order: [['id', 'ASC']]})

        if (!Object.keys(data).length) {
            data = await model.Team.findAll({
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
                ],where: {collegeId: id},order: [['id', 'ASC']]})
        }

        if (!Object.keys(data).length) {
            data = await model.Team.findAll({
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
                ], where: {centralId: id}, order: [['id', 'ASC']]})
        }

        let name = data[0]['dataValues']['majorName'];

        if(!name) {
            name = data[0]['dataValues']['categoryDetail']
        }

        console.log(name);

        const finalData = {"id": id, "organizationName": name, "Teams": data}


        // console.log(data)

        return res.status(200).json(finalData);
    } catch (e) {
        return res.status(501).send('공약 불러오기 오류');
    }
}

const postPromiseQna = async(req, res, next) => {
    try {
        const { comment, teamId, type} = req.body;

        await model.Qna.create({
            teamId: teamId,
            comment: comment,
            type: type,
        })

        return res.status(204).end();

    } catch (e) {
        console.log(e)
        return res.status(501).send('QnA 등록 오류');
    }
}

module.exports={ getPromise, postPromiseQna };