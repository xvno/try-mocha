// NOTE: CODE spec.
/**
 * 6 digits, left 3 module specified, last 3 stuff detail
 * 100x: db,
 * 200x: networking,
 * 300x: fs, copy, read...
 * 400x: convting,
 * 500x: vendor api
 *
 */
const CODE = {
    STATE_OK: 0,
    STATE_ERROR: 1,
    DB_ACCESS: 100100,
    DB_INSERT: 100110,
    DB_UPDATE: 100120,
    DB_READ: 100130,
    DB_NO_DATA: 100200,
    ECONNABORTED: 'NW_CONN_ABORT',
    NW_ACCESS: 200100,
    API_NO_DATA: 500200,
    API_PARAM: 500210
};

const MESSAGE = {
    DB_ACCESS: '数据库存取',
    DB_INSERT: '数据库写',
    DB_UPDATE: '数据库更新',
    DB_READ: '数据库读取',
    DB_NO_DATA: '数据库无数据',
    ECONNABORTED: '网络中断',
    NW_ACCESS: '网络',
    API_NO_DATA: '接口响应中无数据',
    API_PARAM: '接口参数'
};

module.exports = {
    CODE,
    MESSAGE
};
