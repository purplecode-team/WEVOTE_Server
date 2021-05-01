const Sequelize = require('sequelize');
module.exports = class Banner extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            startDate: {
                type: Sequelize.DATE,
                allowNull: true
            },
            endDAte: {
                type: Sequelize.DATE,
                allowNull: false,
            }
        }, {
            sequelize,
            tableName: 'Banner',
            timestamps: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {}
};