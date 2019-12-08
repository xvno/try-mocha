module.exports = {
    isValidType,
    isValidObject,
    isValidPlainObject,
    isValidString,
    isValidStringArg,
    isValidNumber,
    isValidArray,
    isValidKeyArray,
    isValidFunction,
    isValidSymbol,
    getType,
    traversGet,
    pickItems,
    isNull
};

/**
 * @param {Object} arg
 */
function isValidPlainObject(arg) {
    // {}, new Object(): {__proto__: Object, prototype: undefined}
    if (isValidType(arg, 'Object')) {
        let isConstructorValid = arg.constructor === Object;
        let isDunderProtoValid =
            isValidObject(arg.__proto__) && arg.__proto__ === Object.prototype;
        let isPrototypeValid = arg.prototype === undefined;
        if (isConstructorValid && isDunderProtoValid && isPrototypeValid) {
            return true;
        }
    }
    return false;
}
function isNull(obj) {
    return [undefined, null].indexOf(obj) > -1 ? true : false;
}
function isValidKeyArray(arg) {
    // String, number, Symbol
    if (isValidArray(arg)) {
        let deduped = [...new Set(arg)];
        if (deduped.length === arg.length) {
            let ret = deduped.find(i => {
                return !(
                    isValidString(i) ||
                    isValidNumber(i) ||
                    isValidSymbol(i)
                );
            });
            if (ret === undefined) {
                return true;
            }
        }
    }
    return false;
}

function isValidArray(arg) {
    return isValidType(arg, 'Array');
}

function isValidNumber(arg) {
    return isValidType(arg, 'Number');
}

function isValidSymbol(arg) {
    return isValidType(arg, 'Symbol');
}

function isValidObject(arg) {
    return isValidType(arg, 'Object');
}
function isValidStringArg(arg) {
    return isValidString(arg) && arg.length > 0;
}
function isValidString(arg) {
    return isValidType(arg, 'String');
}

function isValidFunction(arg) {
    return isValidType(arg, 'Function');
}

function isValidType(arg, typeStr) {
    // Number, String, Boolean, Function, Object, Array, Date, RegExp, Map, Set, NaN, Undefined, Symbol
    return getType(arg) === typeStr;
}

function getType(arg) {
    let raw = Object.prototype.toString.apply(arg);
    let argType = raw.substring(8, raw.length - 1);
    if (argType === 'Number' && isNaN(arg)) {
        return 'NaN';
    }
    return argType;
}

function traversGet(obj, zigzag) {
    let ret = obj;
    if (isValidPlainObject(obj)) {
        let parts = zigzag.split('.');
        let len = parts.length;
        if (len > 0) {
            for (i = 0; i < len; i++) {
                ret = ret[parts[i]];
                if (ret === null && i < len - 1) {
                    ret = ret[parts[i]] = {};
                }
            }
        }
    }
    return ret;
}

/**
 *
 * @param {Object} obj: 原始对象
 * @param {Array of Strings} keyList: 需要从原始对象中摘出来的属性键值
 */
function pickItems(obj, keyList) {
    let ret = {};
    if (isValidPlainObject(obj) && isValidKeyArray(keyList)) {
        keyList.forEach(i => {
            ret[i] = obj[i] || undefined;
        });
    }
    return ret;
}
