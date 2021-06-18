const Sequelize = require('sequelize');
module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      userId: {
        type: Sequelize.STRING(500),
        allowNull: true,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      provider: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'local'
      },
      snsId: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: 'user'
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
