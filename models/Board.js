const Sequelize = require('sequelize');
module.exports = class Board extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      boardCategory: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      boardDetail: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      content: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      agree: {
        type: Sequelize.INTEGER.ZEROFILL,
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'Board',
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db) {
    db.Board.hasMany(db.BoardComment, {foreignKey: 'boardId', sourceKey: 'id'})

    db.Board.belongsTo(db.User, {foreignKey: 'userId', targetKey: 'userId'});
  }
};
