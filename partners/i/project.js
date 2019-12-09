const { app } = require('./networking');
const { secrets } = require('../../conf');
const { getSign } = require('./utils');
const { bc, secretKey } = secrets;
const { CODE, MESSAGE } = require('../code');

const qs = require('querystring');

const {
    isValidArray,
    isValidStringArg,
    isValidPlainObject
} = require('../../utils/utils');

function fetchProjectList(userid, accessToken) {
    let pathName = '/api/shoot/projects';
    let queryObj = {
        uid: userid,
        access_token: accessToken,
        bc: bc,
        ts: Date.now()
    };
    let sign = getSign(queryObj, secretKey);
    if (isValidStringArg(sign)) {
        queryObj.sign = sign;
        return app
            .get(`${pathName}?${qs.stringify(queryObj)}`)
            .then(v => {
                let list = v.data && v.data.data;
                if (isValidArray(list)) {
                    let data = list.map(p => {
                        return { id: p.projectId, name: p.projectName, userid };
                    });
                    return Promise.resolve({
                        state: CODE.STATE_OK,
                        data
                    });
                } else {
                    return Promise.reject({
                        state: CODE.STATE_ERROR,
                        data: {
                            detail: MESSAGE.API_NO_DATA,
                            error: null
                        }
                    });
                }
            })
            .catch(e => {
                return Promise.reject({
                    state: CODE.STATE_ERROR,
                    code: CODE.NW_ACCESS,
                    data: {
                        detail: e.code || '未知错误',
                        error: e
                    }
                });
            });
    } else {
        return Promise.reject({
            state: CODE.STATE_ERROR,
            code: CODE.API_PARAM,
            data: {
                detail: MESSAGE.API_PARAM,
                error: new Error(MESSAGE.API_PARAM)
            }
        });
    }
}

function fetchProjectScene(userid, accessToken, projectid) {
    let pathName = '/api/shoot/scenes';
    let queryObj = {
        projectId: projectid,
        // uid: userid,
        access_token: accessToken,
        bc: bc,
        ts: Date.now()
    };
    let sign = getSign(queryObj, secretKey);
    if (isValidStringArg(sign)) {
        queryObj.sign = sign;
        return app
            .get(`${pathName}?${qs.stringify(queryObj)}`)
            .then(v => {
                console.log('Got v in fetchSceneList@api/iqiyi/project.js ');
                // console.log(v);
                console.log('Got v.data\n', v.data);
                let rawData = v.data && v.data.data;
                if (isValidPlainObject(rawData)) {
                    // TODO: fetchProjectList: add paginator
                    let data = formatRawData(rawData, userid);
                    // console.log('data: ', JSON.stringify(data));
                    return Promise.resolve({
                        state: 0,
                        data: data
                    });
                } else {
                    return Promise.reject({
                        state: 1,
                        data: {
                            detail: '服务器响应信息中不包含 .data 数据',
                            error: null
                        }
                    });
                }
            })
            .catch(e => {
                console.log('Got e in project.fetchSceneList\n', e);
                return Promise.reject({
                    state: 1,
                    data: {
                        detail: e.code || '未知错误',
                        error: e
                    }
                });
            });
    } else {
        return Promise.reject({
            state: 1,
            data: {
                detail: '未能得到正确的请求参数:sign',
                error: null
            }
        });
    }
}

function formatRawData(data, userid) {
    // API: api/shoot/scenes

    let projectid = data.projectId;
    let projectname = data.projectName;
    let episodes = data.episodes;
    let episodelist, scenelist;
    let ret = {
        userid,
        id: projectid,
        name: projectname
    };
    if (isValidArray(episodes)) {
        episodelist = episodes.reduce((pre, cur) => {
            // console.log('episode:\n', cur);
            let episode = { projectid, id: cur.episodeId, num: cur.episodeNum };
            let scenes = cur.scenes;
            if (isValidArray(scenes)) {
                scenelist = scenes.reduce((spre, scur) => {
                    scur.projectid = projectid;
                    scur.episodeid = episode.id;
                    delete cur['episodeId'];
                    spre.push(scur);
                    return spre;
                }, []);
                episode.children = scenelist;
            }
            // TODO: shot-take 已经格式化好存储在 shotlist中
            pre.push(episode);
            return pre;
        }, []);
        if (episodelist.length > 0) {
            ret.children = episodelist;
        }
    }
    console.log('ret:\n', ret);
    return ret;
}

module.exports = {
    fetchProjectList,
    fetchProjectScene
};
