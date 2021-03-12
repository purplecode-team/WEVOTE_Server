const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Board = require('./Board')(sequelize,Sequelize)
db.BoardComment = require('./BoardComment')(sequelize,Sequelize)
db.Category = require('./Category')(sequelize,Sequelize)
db.Department = require('./Department')(sequelize,Sequelize)
db.Notice = require('./Notice')(sequelize,Sequelize)
db.Promise = require('./Promise')(sequelize,Sequelize)
db.promiseCategory = require('./promiseCategory')(sequelize,Sequelize)
db.QnaComment = require('./QnaComment')(sequelize,Sequelize)
db.Question= require('./Question')(sequelize,Sequelize)
db.Runner = require('./Runner')(sequelize,Sequelize)
db.User = require('./User')(sequelize,Sequelize)

db.get('/', async (req, res, next) => {
    try {
        const users = await db.User.findAll();
        const runner = await db.Runner.findAll();
        // res.render('sequelize', {users});
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = db;