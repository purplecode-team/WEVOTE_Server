const Sequelize = require('sequelize');
module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      userId: {
        type: Sequelize.STRING(255),
        allowNull: false,
        primaryKey: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      collegeName: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      majorName: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(255),
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'User',
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db) {
    db.User.hasMany(db.Qna, {foreignKey: 'userId', sourceKey: 'userId'});
    db.User.hasMany(db.QnaComment, {foreignKey: 'userId', sourceKey: 'userId'});
    db.User.hasMany(db.Board, {foreignKey: 'userId', sourceKey: 'userId'});
    db.User.hasMany(db.BoardComment, {foreignKey: 'userId', sourceKey: 'userId'});
  }
};
