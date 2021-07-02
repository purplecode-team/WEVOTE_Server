const Sequelize = require('sequelize');
module.exports = class ElectionInfo extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            image: {
                type: Sequelize.STRING(255),
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'ElectionInfo',
            timestamps: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {}
};