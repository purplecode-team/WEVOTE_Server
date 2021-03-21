const Sequelize = require('sequelize');
module.exports = class Runner extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      /* team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      }, */
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      studentNum: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      major: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      position: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      base64: {
        type: Sequelize.STRING(255),
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'Runner',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            {name: "id"},
            {name: "team_id"},
            {name: "category_id"},
          ]
        },
      ],
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  static associate(db) {
    db.Runner.belongsTo(db.RunnerTeam, {foreignKey: 'team_id', targetKey: 'id'});
  }
};
