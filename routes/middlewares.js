const jwt = require('jsonwebtoken')

// 로그인 여부 검사
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send({message: '로그인 필요'});
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
}

exports.verifyToken = (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.'
            })
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.'
        })
    }
}

exports.verifyAdmin = (req, res, next) => {
    if (req.decoded.status === "admin") {
            next();
    } else {
        return res.status(410).json({
            code: 410,
            success: false,
            message: '접근 권한이 없습니다.'
        })
    }
}