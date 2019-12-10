const qs = require('querystring');

const { uac } = require('./networking');
const { secrets } = require('../../conf');

const { isValidObject, isValidString } = require('../../utils/utils');
const { CODE, MESSAGE } = require('../code');
const {
    /* bc,
    bcSecretKey,
    accessKey,
    secretKey,
    users, */
    clientId,
    clientSecret,
    grantType
} = secrets;

function doAuth(username, password) {
    // 参数组合
    let opt = qs.stringify({
        username,
        password,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: grantType,
        scope: 'all'
    });
    return uac.post('/oauth/token', opt);
    // 合成请求链接
    // 请求登录接口
}

function logout() {}

function fetchUserInfo(authInfo) {
    let accessToken = authInfo['access_token'];
    if (isValidString(accessToken)) {
        let opt = qs.stringify({
            access_token: accessToken
        });
        return uac.get(`/resource/users/current?${opt}`);
    } else {
        return Promise.reject(new Error('无access_token信息'));
    }
}

function login(formData) {
    console.log('Jumped into login');

    let { username, password } = formData;
    if (isValidString(username) && isValidString(password)) {
        let authInfo;
        return doAuth(username, password)
            .then(
                v => {
                    // 登录成功
                    console.log(
                        'Got v from api.iqiyi.user.login.uac.post.then'
                    );
                    // console.log(v);
                    // 获取用户信息
                    authInfo = v.data;
                    return fetchUserInfo(authInfo);
                }
                /* , r => {
                    // 登录失败
                    console.log('Got r from api.iqiyi.user.login.uac.post');
                    return Promise.reject(r); // tranx to Line:87
                } */
            )
            .then(v => {
                // 已获取用户信息: v
                /* console.log(
                    'Got v from qpi.iqiyi.user.login.uac.post.then.then\n',
                    v
                ); */

                let userInfo = v.data && v.data.data;
                if (isValidObject(userInfo)) {
                    return Promise.resolve({
                        state: CODE.STATE_OK,
                        data: Object.assign({}, authInfo, userInfo)
                    });
                } else {
                    return Promise.reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.API_NO_DATA,
                        data: {
                            detail: '用户信息为空',
                            error: null
                        }
                    });
                }
            })
            .catch(err => {
                console.log('Caught e in api/iqiyi/user.login.catch');
                // console.log(err);
                return Promise.reject({
                    state: CODE.STATE_ERROR,
                    code: err.code,
                    data: {
                        detail: err.code || '',
                        error: err
                    }
                });
            });
    } else {
        return Promise.reject({
            state: CODE.STATE_ERROR,
            message: MESSAGE.API_PARAM,
            data: {
                detail: '用户名 or 密码错误',
                error: { username, password }
            }
        });
    }
}

module.exports = {
    doAuth,
    logout,
    fetchUserInfo,
    login
};
