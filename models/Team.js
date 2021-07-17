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
        db.Team.hasMany(db.Runner, {foreignKey: 'teamId', sourceKey: 'id', onDelete: 'SET NULL'});
        db.Team.hasMany(db.Promises, {foreignKey: 'teamId', sourceKey: 'id', onDelete: 'SET NULL'});
        db.Team.hasMany(db.Qna, {foreignKey: 'teamId', sourceKey: 'id', onDelete: 'SET NULL'});
        //db.Team.hasMany(db.Schedule, {foreignKey:'teamId', sourceKey:'id'});
        db.Team.belongsTo(db.Major, {foreignKey: 'majorId', targetKey: 'id'});
        db.Team.belongsTo(db.College, {foreignKey: 'collegeId', targetKey: 'id'});
        db.Team.belongsTo(db.Central, {foreignKey: 'centralId', targetKey: 'id'});
    }
};