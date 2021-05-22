
require('dotenv').config();

module.exports = {
    development: {
        username: 'purplecode',
        password: process.env.SEQUELIZE_PASSWORD,
        database: 'voteService',
        host: '127.0.0.1',
        dialect: 'mysql',
    },
    test: {
        username: "purplecode",
        password: process.env.SEQUELIZE_PASSWORD,
        database: "voteService_test",
        host: "127.0.0.1",
        dialect: "mysql"
    },
    production: {
        username: 'purplecode',
        password: process.env.SEQUELIZE_PASSWORD,
        database: 'voteService',
        host: '127.0.0.1',
        dialect: 'mysql',
        logging: false,
    },
};