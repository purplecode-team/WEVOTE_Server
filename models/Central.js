const Sequelize = require('sequelize');
module.exports = class Central extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            centralName: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            }
        }, {
            sequelize,
            tableName: 'Central',
            timestamps: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.Central.hasMany(db.Team, {foreignKey: 'centralId', sourceKey: 'id'});
    }
};
