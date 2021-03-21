const Sequelize = require('sequelize');
module.exports = class RunnerTeam extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            /* category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            }, */
            order: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false
            },
            slogan: {
                type: Sequelize.STRING(255),
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'RunnerTeam',
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        {name: "id"},
                        {name: "category_id"},
                    ]
                },
            ],
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.RunnerTeam.belongsTo(db.Category, {foreignKey: 'category_id', targetKey: 'id'});
        db.RunnerTeam.hasMany(db.Runner, {foreignKey: 'team_id', sourceKey: 'id'});
    }
};