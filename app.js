const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('./passport'); // passport 모듈 app.js와 연결

const {sequelize} = require('./models');
const passportConfig = require('/routes/passport');

dotenv.config();

const app = express();
passportConfig(); // passport 설정
app.set('port', process.env.PORT || 8001);

sequelize.sync({force: false})
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

const mainRouter = require('./routes/main');
const authRouter = require('./routes/auth');
const cors = require("cors");
app.use(cors());
app.use('/api/v1/main', mainRouter);
app.use('/api/v1/auth', authRouter);


app.use((req, res, next) => {
    const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use(passport.initialize());
app.use(passport.session());

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});