const model = require("../models");
const jwt = require('jsonwebtoken');

const issueLoginToken = async (req, res) => {
    const {userId, password} = req.body;
    try {
        const user = await model.User.findOne({
            where: {userId}
        })
        const token = jwt.sign({
            userId: user.userId,
            status: user.status,
        }, process.env.JWT_SECRET, {
            expiresIn: '1m',
            issuer: 'wevote',
        });
        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다',
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
}

module.exports = {issueLoginToken}