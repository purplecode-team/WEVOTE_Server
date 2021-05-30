const Sequelize = require('sequelize');
module.exports = class Promises extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      promiseType: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      promiseOrder: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      promiseTitle: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      promiseDetail: {
        type: Sequelize.STRING(255),
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'Promises',
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db) {

    db.Promises.belongsTo(db.Team, {foreignKey: 'teamId', sourceKey: 'id'});
  }
};
