const app = require('./app');

// app.listen(app.get('port'), () => {
//     console.log(app.get('port'), '번 포트에서 대기중');
// });

const exec = require('child_process').exec;
const path = require('path');
const client = exec('npm run start', {
    windowsHide: true,
    cwd: path.join(__dirname, './'),
});

client.stdout.pipe(process.stdout);
client.stderr.pipe(process.stderr);
