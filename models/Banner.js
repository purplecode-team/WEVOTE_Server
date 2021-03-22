const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Banner', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        dep_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        content: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'Board',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "id" },
                    { name: "student_id" },
                    { name: "dep_id" },
                    { name: "category_id" },
                ]
            },
        ]
    });
};
