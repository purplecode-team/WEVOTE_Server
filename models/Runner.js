const Sequelize = require('sequelize');
module.exports = class Runner extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      major: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      studentNum: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      position: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      picture: {
        type: Sequelize.STRING(255),
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'Runner',
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db) {
    db.Runner.belongsTo(db.Team, {foreignKey: 'teamId', targetKey: 'id'});
  }
};
