module.exports = {
    traversSet,
    traversPatch,
    patch
};

const { isValidPlainObject, isValidArray, isValidString } = require('../../utils/utils');

function traversSet(obj, zigzag, value) {
    let ret = obj;
    if (isValidPlainObject(obj) && isValidString(zigzag)) {
        let parts = zigzag.split('.');
        let len = parts.length - 1;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                let pre = ret[parts[i]];
                if (!isValidPlainObject(pre) && !isValidArray(pre)) {
                    if (0 == parts[i] || ~~parts[i] > 0) {
                        ret[parts[i]] = [];
                    } else {
                        ret[parts[i]] = {};
                    }
                }
                ret = ret[parts[i]];
            }
        }
        ret[parts[len]] = value;
    }
}

function traversPatch(obj, zigzag, value, action, arrayKeys = ['children']) {
    let ret = obj;
    if (isValidPlainObject(obj) && isValidString(zigzag)) {
        let parts = zigzag.split('.');
        // console.log('parts: ', parts);
        let len = parts.length - 1;
        let segPath = '';
        if (len >= 0) {
            for (let i = 0; i < len; i++) {
                segPath = parts[i];
                let pre = ret[segPath];
                if (!isValidPlainObject(pre) && !isValidArray(pre)) {
                    if (arrayKeys.indexOf(segPath) > -1) {
                        ret[segPath] = [];
                    } else {
                        ret[segPath] = {};
                    }
                }
                ret = ret[segPath];
                // console.log('segPath: ', segPath);
            }
            segPath = parts[len];
            // console.log('segPath: ', segPath);
            // console.log('heya--------------------');
            switch (action) {
                case '$push':
                    // console.log('$push: ', ret[segPath], '\n', value);
                    if (
                        /*     0 == segPath ||
                        ~~segPath > 0 || */
                        arrayKeys.indexOf(segPath) > -1
                    ) {
                        if (!isValidArray(ret[segPath])) {
                            ret[segPath] = [];
                        }
                        /* console.log(
                            `>>> pushing ${value} into \n`,
                            ret[segPath]
                        ); */
                        ret[segPath].push(value);
                    }
                    break;
                case '$set':
                    // console.log('$set: ', ret[segPath], '\n', value);
                    ret[segPath] = value;
                    break;
                case '$remove':
                    delete ret[segPath];
                    break;

                default:
                    break;
            }
            // console.log('result: ', ret[segPath]);
            // console.log('--------------------yahe');
        }
    }
    return obj;
}

/**
 *
 * @param {Object} obj
 * @param {Array of objects} ops: patch list~
 */
function patch(obj, ops) {
    if (isValidPlainObject(obj) && isValidArray(ops)) {
        // console.log('Ops: \n', JSON.stringify(ops));
        ops.forEach(d => {
            traversPatch(obj, d.path, d.value, d.action);
        });
    }
    return obj;
}
