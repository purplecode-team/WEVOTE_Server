const Sequelize = require('sequelize');
module.exports = class Department extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      /* category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      }, */
      college: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      dep_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      base64: {
        type: Sequelize.STRING(255),
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'Department',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            {name: "id"},
            // {name: "category_id"},
          ]
        },
      ],
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db) {
    db.Department.belongsTo(db.Category, {foreignKey: 'category_id', targetKey: 'id'});
  }
};
