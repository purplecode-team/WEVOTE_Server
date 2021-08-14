# WEVOTE_Server


## 기능 소개

대학 온라인 선거 정보 및 관리 서비스 🏫 



## 🛠 기술 스택

<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"/></a>  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=Express&logoColor=white"/></a>  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white"/></a> <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white"/></a> <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=Amazon AWS&logoColor=white"/></a> 

    "atob": "^2.1.2",
    "aws-sdk": "2.761.0",  
    "bcrypt": "5.0.1",  
    "cookie-parser": "~1.4.5",  
    "cors": "^2.8.5",  
    "cross-env": "7.0.3",  
    "csurf": "1.11.0",  
    "debug": "~4.3.1",  
    "dotenv": "^8.2.0",  
    "express": "^4.17.1",  
    "express-session": "^1.17.1",  
    "File": "^0.10.2",  
    "fs": "0.0.1-security",  
    "helmet": "4.6.0",  
    "hpp": "0.2.3",  
    "jsonwebtoken": "8.5.1",  
    "moment": "^2.29.1",  
    "morgan": "^1.10.0",  
    "multer": "^1.4.2",  
    "multer-s3": "2.9.0",  
    "mysql2": "^2.2.5",  
    "node-blob": "0.0.2",  
    "parse-server": "^4.5.0",  
    "passport": "^0.4.1",  
    "passport-local": "1.0.0",  
    "path": "0.12.7",  
    "pm2": "3.0.x",  
    "request": "2.88.0",  
    "sanitize-html": "2.4.0",  
    "sequelize": "^6.5.0",  
    "sequelize-auto": "^0.8.0",  
    "sequelize-cli": "^6.2.0",  
    "winston": "3.3.3"


## 🗂 프로젝트 구조

    .
    ├── 📒 config
	│	└── config.js
	├── 📒 controllers
	│	├── admin.controller.js
	│	├── auth.controller.js
	│	├── main.controller.js
	│	└── promise.controller.js
	├── 📒 models
	│	├── Banner.js
	│	├── Board.js
	│	├── BoardComment.js
	│	├── Calendar.js
	│	├── Category.js
	│	├── Central.js
	│	├── College.js
	│	├── ElectionInfo.js
	│	├── Major.js
	│	├── Notice.js
	│	├── Promises.js
	│	├── Qna.js
	│	├── QnaComment.js
	│	├── Runner.js
	│	├── Schedule.js
	│	├── Team.js
	│	├── User.js
	│	└── index.js
	├── 📒 passports
	│	├── index.js
	│	└── localStrategy.js
	├── 📒 routes
	│	├── admin.js
	│	├── auth.js
	│	├── index.js
	│	├── main.js
	│	├── middlewares.js
	│	└── promise.js
	├── .gitignore
    ├── app.js
    ├── logger.js
    ├── package-lock.json
    ├── package.json
    └── server.js
