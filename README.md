# purplecode-team2-server

npx sequelize db:create

sudo su
npm start

**프론트 rebuild**<br>
npm run-script build<br>
service nginx restart 프론트서버 재구동

**개발용 서버 구동**<br>
npm run dev

**배포 에러보기**<br>
sudo npx pm2 logs --err

**배포 재시작**<br>
sudo npx pm2 reload all
