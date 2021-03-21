const Sequelize = require('sequelize');
module.exports = class Category extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      isCentral: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      cate_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      base64: {
        type: Sequelize.STRING(255),
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'Category',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "id" },
          ]
        },
      ],
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db) {
    db.Category.hasMany(db.Department, {foreignKey: 'category_id', sourceKey: 'id'});
    db.Category.hasMany(db.RunnerTeam, {foreignKey: 'category_id', sourceKey: 'id'});
    db.Category.hasMany(db.Runner, {foreignKey: 'category_id', sourceKey: 'id'});
  }
};
