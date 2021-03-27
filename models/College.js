const Sequelize = require('sequelize');
module.exports = class College extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            collegeName: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            }
        }, {
            sequelize,
            tableName: 'College',
            timestamps: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.College.hasMany(db.Major, {foreignKey: 'collegeId', sourceKey: 'id'});
        db.College.hasMany(db.Team, {foreignKey: 'collegeId', sourceKey: 'id'});
    }
};
