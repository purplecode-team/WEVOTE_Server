const Sequelize = require('sequelize');
module.exports = class Qna extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      question: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    }, {
      sequelize,
      tableName: 'Qna',
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db) {
    db.Qna.hasMany(db.QnaComment, {foreignKey: 'qnaId', sourceKey: 'id'});

    db.Qna.belongsTo(db.Team, {foreignKey: 'teamId', targetKey: 'id'});
    db.Qna.belongsTo(db.User, {foreignKey: 'userId', targetKey: 'userId'});
  }
};
