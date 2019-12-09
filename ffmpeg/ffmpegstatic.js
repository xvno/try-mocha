const path = require('path');
const ffmpeg = require('ffmpeg-static');
console.log(ffmpeg);

let workingDir = '/Users/volving/Downloads/raw/movs';
let filePath = path.join(workingDir, './A004C013_160226_R4RF.mov');
let output = path.join(workingDir, './m.mp4');

const cp = require('child_process');
const cmd = `${ffmpeg.path}  -i ${filePath} -c:v libx264 -f mp4 ${output}`;
/* let converter = cp.spawn(
    `${ffmpeg.path}  -i ${filePath} -c:v libx264 -f mp4 k.mp4`
);
converter.stdout.on('data', data => {
    console.log(data.toString());
});

converter.stderr.on('data', data => {
    console.error(data.toString());
});

converter.on('exit', code => {
    console.log(`Child exited with code ${code}`);
});
 */

const { exec } = require('child_process');
exec(cmd, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});
