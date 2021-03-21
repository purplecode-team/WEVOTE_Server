const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const Category = require('./Category');
const Board = require('./Board')
const BoardComment = require('./BoardComment')
const Department = require('./Department')
const Notice = require('./Notice')
const Promise = require('./Promise')
const promiseCategory = require('./promiseCategory')
const QnaComment = require('./QnaComment')
const Question= require('./Question')
const Runner = require('./Runner')
const RunnerTeam = require('./RunnerTeam')
const User = require('./User')

const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/* db.Board = require('./Board')(sequelize,Sequelize)
db.BoardComment = require('./BoardComment')(sequelize,Sequelize)
db.Category = require('./Category')(sequelize,Sequelize)
db.Department = require('./Department')(sequelize,Sequelize)
db.Notice = require('./Notice')(sequelize,Sequelize)
db.Promise = require('./Promise')(sequelize,Sequelize)
db.promiseCategory = require('./promiseCategory')(sequelize,Sequelize)
db.QnaComment = require('./QnaComment')(sequelize,Sequelize)
db.Question= require('./Question')(sequelize,Sequelize)
db.Runner = require('./Runner')(sequelize,Sequelize)
db.RunnerTeam = require('./RunnerTeam')(sequelize, Sequelize)
db.User = require('./User')(sequelize,Sequelize) */

// db.Board = Board;
// db.BoardComment = BoardComment;
db.Category = Category;
db.Department = Department;
// db.Notice = Notice;
// db.Promise = Promise;
// db.promiseCategory = promiseCategory;
// db.QnaComment = QnaComment;
// db.Question= Question;
db.Runner = Runner;
db.RunnerTeam = RunnerTeam;
// db.User = User;

// Board.init(sequelize);
// BoardComment.init(sequelize);
Category.init(sequelize);
Department.init(sequelize);
// Notice.init(sequelize);
// Promise.init(sequelize);
// promiseCategory.init(sequelize);
// QnaComment.init(sequelize);
// Question.init(sequelize);
Runner.init(sequelize);
RunnerTeam.init(sequelize);
// User.init(sequelize);

// Board.associate(db);
// BoardComment.associate(db);
Category.associate(db);
Department.associate(db);
// Notice.associate(db);
// Promise.associate(db);
// promiseCategory.associate(db);
// QnaComment.associate(db);
// Question.associate(db);
Runner.associate(db);
RunnerTeam.associate(db);
// User.associate(db);

module.exports = db;