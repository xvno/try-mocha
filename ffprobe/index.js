const path = require('path');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');

let workingDir = '/Users/volving/Downloads/raw/movs';
let filePath = path.join(workingDir, './A004C013_160226_R4RF.mov');
// let output = path.join(workingDir, './m.mp4');

function handleGetFileMeta(args) {
    let { filePath } = args;
    getFileMeta(filePath)
        .then(v => {
            console.log('v: ', v);
        })
        .catch(e => {
            console.log('e: ', e);
        });
}
function getFileMeta(filePath) {
    return new Promise(function(resolve, reject) {
        ffprobe(filePath, { path: ffprobeStatic.path }, function(error, info) {
            if (error) {
                return reject({
                    state: CODE.STATE_ERROR,
                    message: '获取文件meta信息失败',
                    data: {
                        detail: '',
                        error
                    }
                });
            }
            console.log(info);
            resolve({
                state: CODE.STATE_OK,
                data: info
            });
        });
    });
}
/*
module.exports = {
    handleGetFileMeta
};
 */

handleGetFileMeta({ filePath });
