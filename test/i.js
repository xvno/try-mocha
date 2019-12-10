/* globals describe, it, before */
const assert = require('assert');
const { secrets } = require('../conf');
const db = require('../partners/db.js');
const { initDB, getSession, setSession, getSessionLite } = db;

const { users } = secrets;
const { username, password } = users[0];
const { isNull } = require('../utils/utils');
const { login } = require('../partners/i/user');
const { isValidPlainObject, isValidArray } = require('../utils/utils');
const {
    fetchProjectList,
    fetchProjectScene
} = require('../partners/i/project.js');

const {
    setProjectData,
    getSceneList,
    getEpisodeList,
    getProjectData
} = require('../partners/db.js');

describe('DIT', function() {
    describe('API', function() {
        initDB();
        let session = null;
        let userid = null;
        let accessToken;
        let projectList;
        before(function() {
            return getSessionLite().then(v => {
                if (v.ts + v.expires_in <= Date.now()) {
                    console.log('登录...');
                    return login({ username, password })
                        .then(
                            vv => {
                                session = vv.data;
                                userid = session.id;
                                session.userid = userid;
                                accessToken = session.access_token;
                                return vv;
                            },
                            r => {
                                console.log('r: ', r);
                                return Promise.reject(r);
                            }
                        )
                        .then(() => {
                            return setSession(session);
                        })
                        .catch(e => {
                            return Promise.reject(e);
                        });
                }
                console.log('直接获取session...');
                session = v.data;
                userid = session.id;
                session.userid = userid;
                accessToken = session.access_token;
            });
        });
        describe.only('Project', function() {
            describe('# remote', function() {
                it('# fetchProjectList', function() {
                    return fetchProjectList(userid, accessToken).then(v => {
                        console.log('fetchProjectList: v\n', v);
                        projectList = v.data;
                        assert(isValidArray(v.data), 'Should be an list');
                    });
                });
                it('# fetchProjectScene', function() {
                    let projectSceneData;
                    return fetchProjectScene(
                        userid,
                        accessToken,
                        projectList[0].id
                    )
                        .then(
                            v => {
                                // console.log('v: ', v);
                                projectSceneData = v.data;
                                projectList[0] = Object.assign(
                                    projectList[0],
                                    projectSceneData
                                );
                                // console.log('projectList[0]: ', projectList[0]);
                            },
                            r => {
                                console.log('r: ', r);
                            }
                        )
                        .finally(() => {
                            assert(
                                isValidPlainObject(projectSceneData),
                                'should be an object'
                            );
                        });
                });
            });
            describe('# db', function() {
                it('# setProjectData', function() {
                    return setProjectData(projectList[0]).then(v => {
                        console.log('setProjectData.then:\n', v);
                        assert(isValidPlainObject(v), 'should be an object');
                    });
                });
                it('# getEpisodeList', function() {
                    let p = projectList[0];

                    let episodelist = p.children;
                    console.log('episodep amt: ', episodelist.length);
                    return getEpisodeList(userid, p.id).then(v => {
                        console.log('getEpisodeList v:\n', v);
                        assert(
                            isValidPlainObject(v) &&
                                isValidArray(v.data) &&
                                v.data.length == episodelist.length,
                            'should be an normal ret data'
                        );
                    });
                });
                it('# getSceneList', function() {
                    let p = projectList[0];
                    // console.log('p: ', p);
                    let episodelist = p.children;
                    return getSceneList(userid, p.id, episodelist[0].id).then(
                        v => {
                            assert(
                                isValidPlainObject(v) && isValidArray(v.data),
                                'should be an normal ret data'
                            );
                        }
                    );
                });
                it('# getProjectData', function() {
                    let p = projectList[0];
                    console.log('getProjectData: projectid: ', p.id);
                    return getProjectData(userid, p.id).then(v => {
                        console.log('getProjectData: v:\n', v);
                        
                        assert(
                            isValidPlainObject(v) && isValidArray(v.data),
                            'should be an object'
                        );
                    });
                });
            });
        });

        describe('Session', function() {
            it('# getSession: ', function() {
                return getSessionLite().then(v => {
                    console.log('v: ', v);
                    assert(isValidPlainObject(v.data), 'should more than 0');
                });
            });
            it('# getSession: ', function() {
                return getSession().then(v => {
                    console.log('v: ', v);
                    assert(isNull(v.data), 'should more than 0');
                });
            });
            it('# login', function() {
                return login({ username, password }).then(
                    v => {
                        console.log('v: ', v);
                        session = v.data;
                        session.userid = session.id;
                        userid = session.id;
                        return v;
                    },
                    r => {
                        console.log('r: ', r);
                        return Promise.reject(r);
                    }
                );
            });
            it('# setSession: ', function() {
                return setSession(session).then(v => {
                    console.log('setSession-v: ', v);
                });
            });
            it('# getSession: ', function() {
                return getSession(userid).then(v => {
                    console.log('getSession2-v: ', v);
                    assert(isValidPlainObject(v.data), 'should more than 0');
                });
            });
        });
    });
});
