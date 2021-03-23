const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const Category = require('./Category');
const Central = require('./Central');
const College = require('./College');
const Major = require('./Major');
const Runner = require('./Runner');
const Team = require('./Team');
const Board = require('./Board')
const BoardComment = require('./BoardComment')
const Notice = require('./Notice')
const Promises = require('./Promises')
const promiseCategory = require('./promiseCategory')
const QnaComment = require('./QnaComment')
const Question= require('./Question')
const User = require('./User')

const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.Category = Category;
db.Central = Central;
db.College = College;
db.Major = Major;
db.Runner = Runner;
db.Team = Team;

/* db.Board = Board;
db.BoardComment = BoardComment;
db.Notice = Notice;
db.Promise = Promise;
db.promiseCategory = promiseCategory;
db.QnaComment = QnaComment;
db.Question= Question;
db.User = User;
 db.Banner = require('./Banner')(sequelize, Sequelize)*/


Category.init(sequelize);
Central.init(sequelize);
College.init(sequelize);
Major.init(sequelize);
Runner.init(sequelize);
Team.init(sequelize);

/* Board.init(sequelize);
BoardComment.init(sequelize);
Notice.init(sequelize);
Promise.init(sequelize);
promiseCategory.init(sequelize);
QnaComment.init(sequelize);
Question.init(sequelize);
User.init(sequelize); */

Category.associate(db);
Central.associate(db);
College.associate(db);
Major.associate(db);
Runner.associate(db);
Team.associate(db);

/* Board.associate(db);
BoardComment.associate(db);
Notice.associate(db);
Promise.associate(db);
promiseCategory.associate(db);
QnaComment.associate(db);
Question.associate(db);
User.associate(db); */

module.exports = db;