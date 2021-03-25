const Sequelize = require('sequelize');
module.exports = class Team extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            categoryName: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            categoryDetail: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            majorName: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
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
            tableName: 'Team',
            timestamps: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.Team.hasMany(db.Runner, {foreignKey: 'teamId', sourceKey: 'id'});
        db.Team.hasMany(db.Promises, {foreignKey: 'teamId', sourceKey: 'id'});
        db.User.hasMany(db.Qna, {foreignKey: 'teamId', sourceKey: 'id'});
    }
};