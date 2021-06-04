//const app = require('./app');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const helmet = require('helmet');
const hpp = require('hpp');

const {sequelize} = require('./models');

const cors = require("cors");

dotenv.config();

//const logger = require("/logger");


const app = express();
app.set('port', process.env.PORT || 8080);

sequelize.sync({force: false})
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(helmet());
    app.use(hpp());
} else {
    app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secrete: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
};

if (process.env.NODE_ENV === 'production') {
    sessionOption.proxy = 'true';
    // sessionOption.cookie.secure = true;
}


app.use(session(sessionOption))
const mainRouter = require('./routes/main');
const promiseRouter = require('./routes/promise');
const adminRouter = require('./routes/admin');
//const cors = require("cors");
app.use(cors());

app.use('/api/v1/main', mainRouter);
app.use('/api/v1/promise', promiseRouter);

app.use('/api/v1/admin', adminRouter);
app.use((req, res, next) => {
    const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    logger.info('hello');
    logger.error(error.message);
    next(error);
});


app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});

//const exec = require('child_process').exec;
// const path = require('path');
const client = exec('npm run start', {
    windowsHide: true,
    cwd: path.join(__dirname, './'),
});

client.stdout.pipe(process.stdout);
client.stderr.pipe(process.stderr);
