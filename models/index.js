const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const Category = require('./Category');
const Central = require('./Central');
const College = require('./College');
const Major = require('./Major');
const Team = require('./Team');
const Runner = require('./Runner');
const User = require('./User');
const Promises = require('./Promises')
const Qna= require('./Qna');
const QnaComment = require('./QnaComment');
const Board = require('./Board');
const BoardComment = require('./BoardComment');
const Schedule = require('./Schedule');
const Calendar = require('./Calendar');
const Notice = require('./Notice');


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
db.User = User;
db.Promises = Promise;
db.Qna= Qna;
db.QnaComment = QnaComment;
db.Board = Board;
db.BoardComment = BoardComment;
db.Schedule = Schedule;
db.Calendar = Calendar;
db.Notice = Notice;


Category.init(sequelize);
Central.init(sequelize);
College.init(sequelize);
Major.init(sequelize);
Runner.init(sequelize);
Team.init(sequelize);
Promises.init(sequelize);
User.init(sequelize);
Qna.init(sequelize);
QnaComment.init(sequelize);
Board.init(sequelize);
BoardComment.init(sequelize);
Schedule.init(sequelize);
Calendar.init(sequelize);
Notice.init(sequelize);


Category.associate(db);
Central.associate(db);
College.associate(db);
Major.associate(db);
Runner.associate(db);
Team.associate(db);
Promises.associate(db);
User.associate(db);
Qna.associate(db);
QnaComment.associate(db);
Board.associate(db);
BoardComment.associate(db);
Schedule.associate(db);
Calendar.associate(db);
Notice.associate(db);

module.exports = db;