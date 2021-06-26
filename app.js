// const express = require('express');
// const cookieParser = require('cookie-parser');
// const morgan = require('morgan');
// const path = require('path');
// const session = require('express-session');
// const dotenv = require('dotenv');
// const helmet = require('helmet');
// const hpp = require('hpp');
//
// const {sequelize} = require('./models');
//

//
// dotenv.config();
//
// //const logger = require("/logger");
//
//
// const app = express();
// app.set('port', process.env.PORT || 8080);
//
// sequelize.sync({force: false})
//     .then(() => {
//         console.log('데이터베이스 연결 성공');
//     })
//     .catch((err) => {
//         console.error(err);
//     });
//
// if (process.env.NODE_ENV === 'production') {
//     app.use(morgan('combined'));
//     app.use(helmet());
//     app.use(hpp());
// } else {
//     app.use(morgan('dev'));
// }
//
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser(process.env.COOKIE_SECRET));
//
// const sessionOption = {
//     resave: false,
//     saveUninitialized: false,
//     secrete: process.env.COOKIE_SECRET,
//     cookie: {
//         httpOnly: true,
//         secure: false,
//     }
// };
//
// if (process.env.NODE_ENV === 'production') {
//     sessionOption.proxy = 'true';
//     // sessionOption.cookie.secure = true;
// }
//
//
// app.use(session(sessionOption))
// const mainRouter = require('./routes/main');
// const promiseRouter = require('./routes/promise');
// const adminRouter = require('./routes/admin');
// //const cors = require("cors");
// app.use(cors());
//
// app.use('/api/v1/main', mainRouter);
// app.use('/api/v1/promise', promiseRouter);
// app.use('/api/v1/admin', adminRouter);
//
// app.use((req, res, next) => {
//     const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
//     error.status = 404;
//     logger.info('hello');
//     logger.error(error.message);
//     next(error);
// });

// export default app;

// app.listen(app.get('port'), () => {
//     console.log(app.get('port'), '번 포트에서 대기중');
// });




/////////////////////////////////////////////




const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport'); // passport 모듈 app.js와 연결
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require("cors");




dotenv.config();
// const redisClient = redis.createClient({
//     url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
//     password: process.env.REDIS_PASSWORD,
// });
const mainRouter = require('./routes/main');
const promiseRouter = require('./routes/promise');
const adminRouter = require('./routes/admin');
const v1Router = require('./routes/v1.0.0');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');
const logger = require('./logger');
const passportConfig = require('./passport');
const app = express();

const { verifyToken, verifyAdmin } = require('./routes/middlewares');

passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT || 8080);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

let corsOption = {
    origin: 'http://localhost:80',// 허락하는 요청 주소
    credentials: true // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
}

app.use(cors(corsOption)); // CORS 미들웨어 추가

sequelize.sync({ force: false })
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
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
        saveUninitialized: true,
        maxAge: 60*60*1000,
    },
};
if (process.env.NODE_ENV === 'production') {
    sessionOption.proxy = true;
    // sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));

// app.use(passport.initialize());
// app.use(passport.session());

app.use(passport.initialize());
app.use(passport.session());
app.use('/api/v1/main', mainRouter);
app.use('/api/v1/promise', promiseRouter);
app.use('/api/v1/admin', verifyToken, verifyAdmin, adminRouter);
app.use('/api/v1/v1.0.0', v1Router)
app.use('/api/v1/auth', authRouter);

app.use((req, res, next) => {
    const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    logger.info('hello');
    logger.error(error.message);
    next(error);
});

app.use((err, req, res, next) => {
    console.error(err);
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;