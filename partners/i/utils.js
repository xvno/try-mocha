const { isValidPlainObject, isValidString } = require('../../utils/utils');
const crypto = require('crypto');

function getSign(obj, secretKey) {
    if (isValidPlainObject(obj) && isValidString(secretKey)) {
        let keys = Object.keys(obj);
        keys.sort();
        let que = [];
        keys.forEach(k => {
            que.push(`${k}=${obj[k]}`);
        });
        que.push(secretKey);
        return md5sum(que.join('|'));
        /*
        let ribbon = que.join('|');
        let hasher = crypto.createHash('md5');
        hasher.update(ribbon);
        return hasher.digest('hex'); */
    }
    return '';
}

function md5sum(str) {
    let hasher = crypto.createHash('md5');
    hasher.update(str);
    return hasher.digest('hex');
}

module.exports = {
    getSign
};
