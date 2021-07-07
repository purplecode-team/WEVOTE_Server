require('dotenv').config();

module.exports = {
    development: {
        username: 'purplecode',
        password: process.env.SEQUELIZE_PASSWORD,
        database: 'univvotedb',
        host: 'univvotedb.cfgbs9nzcfco.ap-northeast-2.rds.amazonaws.com',
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
        database: 'univvotedb',
        host: 'univvotedb.cfgbs9nzcfco.ap-northeast-2.rds.amazonaws.com',
        dialect: 'mysql',
        logging: false,
    },
};