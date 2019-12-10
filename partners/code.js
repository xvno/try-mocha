// NOTE: CODE spec.
/**
 * 6 digits, left 3 module specified, last 3 stuff detail
 * 100x: db,
 * 200x: networking,
 * 300x: fs, copy, read...
 * 400x: convting,
 * 500x: local api
 * 600x: vendor api: I for iqiyi
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

    API_ERROR: 500000,
    API_PARAM: 500100,
    API_RET: 500110,
    API_NO_DATA: 500120,
    API_DATA_TYPE: 500130,

    API_ERROR_I: 600000,
    API_PARAM_I: 600100,
    API_RET_i: 600110,
    API_NO_DATA_I: 600120,
    API_DATA_TYPE_I: 600130
};

const MESSAGE = {
    DB_ACCESS: '数据库存取',
    DB_INSERT: '数据库写',
    DB_UPDATE: '数据库更新',
    DB_READ: '数据库读取',
    DB_NO_DATA: '数据库无数据',
    ECONNABORTED: '网络中断',
    NW_ACCESS: '网络',

    API_ERROR: '接口错误',
    API_PARAM: '接口参数',
    API_RET: '接口响应出错',
    API_NO_DATA: '接口响应中无数据',
    API_DATA_TYPE: '接口响应中数据格式错误',

    API_ERROR_I: '第三方接口错误',
    API_PARAM_I: '第三方接口参数',
    API_RET_I: '第三方接口响应出错',
    API_NO_DATA_I: '第三方接口响应中无数据',
    API_DATA_TYPE_I: '第三方接口响应中数据格式错误'
};

module.exports = {
    CODE,
    MESSAGE
};
