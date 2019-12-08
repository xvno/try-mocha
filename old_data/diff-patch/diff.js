const { getType } = require('../../utils/utils');
module.exports.init = function init() {
    let zigzag = [];
    let ops = [];
    return function diff(remotes, locals) {
        // console.log('remotes: \n', remotes);
        // console.log('locals: \n', locals);
        let rtype = getType(remotes);
        let ltype = getType(locals);
        let keys = null;
        debugger;
        if (rtype === ltype) {
            switch (rtype) {
                case 'Object':
                    if (remotes.id === locals.id) {
                        keys = Object.keys(remotes);
                        keys.splice(keys.indexOf('id'), 1);
                        // console.log(keys);
                        keys.forEach(k => {
                            zigzag.push(k);
                            diff(remotes[k], locals[k]);
                            zigzag.pop();
                        });
                    } else {
                        ops.push({
                            path: Object.assign([], zigzag).join('.'),
                            action: '$push',
                            value: remotes
                        });
                    }

                    break;
                case 'Array':
                    remotes.forEach((ritem, idx) => {
                        let litem =
                            locals.find(ll => ll.id === ritem.id) || null;
                        if (null === litem) {
                            ops.push({
                                path: Object.assign([], zigzag).join('.'),
                                action: '$push',
                                value: ritem
                            });
                        } else {
                            zigzag.push(idx);
                            diff(ritem, litem);
                            zigzag.pop();
                        }
                    });
                    break;
                default:
                    // console.log( `remotes: ${remotes} :::: locals: ${locals}`, 'equals? ', remotes === locals );
                    if (remotes !== locals) {
                        ops.push({
                            path: Object.assign([], zigzag).join('.'),
                            action: '$set',
                            value: remotes
                        });
                    }
            }
        } else {
            ops.push({
                path: Object.assign([], zigzag).join('.'),
                action: '$set',
                value: remotes
            });
        }
        return ops;
    };
};
