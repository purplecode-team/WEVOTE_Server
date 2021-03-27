const Sequelize = require('sequelize');
module.exports = class Major extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      majorName: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      }
    }, {
      sequelize,
      tableName: 'Major',
      timestamps: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db) {
    db.Major.belongsTo(db.College, {foreignKey: 'collegeId', targetKey: 'id'});
    db.Major.hasMany(db.Team, {foreignKey: 'majorId', sourceKey: 'id'});
  }
};
