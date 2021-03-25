const Sequelize = require('sequelize');
module.exports = class QnaComment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      qnaAnswer: {
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
      tableName: 'QnaComment',
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db) {

    db.QnaComment.belongsTo(db.Qna, {foreignKey: 'qnaId', targetKey: 'id'});
    db.QnaComment.belongsTo(db.User, {foreignKey: 'userId', targetKey: 'userId'});
  }
};
