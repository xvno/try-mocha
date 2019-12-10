/*globals __dirname */
const _ = require('lodash');
const Nedb = require('nedb');
const path = require('path');
const { CODE, MESSAGE } = require('./code.js');
let db = null;
let dbfile = path.resolve(__dirname, 'database');
const {
    isValidArray /* , isValidPlainObject */
} = require('../utils/utils.js');

console.log('dbfile: \n', dbfile);

function initDB() {
    db = new Nedb({
        filename: dbfile,
        autoload: true
    });
    return db;
}

function getSessionLite() {
    return new Promise(function(resolve, reject) {
        db.findOne({ mag: 'session' }, (err, doc) => {
            if (err) {
                reject({
                    state: CODE.STATE_ERROR,
                    message: MESSAGE.DB_ACCESS,
                    data: {
                        detail: '获取"Session(Lite)"信息出错',
                        error: err
                    }
                });
            }
            resolve({
                state: CODE.STATE_OK,
                data: doc
            });
        });
    });
}
function getSession(userid) {
    return new Promise(function(resolve, reject) {
        db.findOne({ mag: 'session', userid }, (err, doc) => {
            if (err) {
                reject({
                    state: CODE.STATE_ERROR,
                    message: MESSAGE.DB_ACCESS,
                    data: {
                        detail: '获取"Session"信息出错',
                        error: err
                    }
                });
            }
            resolve({
                state: CODE.STATE_OK,
                data: doc
            });
        });
    });
}

function setSession(session) {
    let { userid } = session;
    let newSession = Object.assign(session, {
        ts: Date.now()
    });
    return new Promise(function(resolve, reject) {
        db.update(
            {
                mag: 'session',
                userid
            },
            {
                $set: newSession
            },
            {
                upsert: true
            },
            (err, amt, upsert) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: '存储"Session"信息出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: CODE.STATE_OK,
                    data: {
                        amt,
                        upsert
                    }
                });
            }
        );
    });
}

/*****************************************************************************************************************/

function getProjectList(userid) {
    return new Promise(function(resolve, reject) {
        db.find(
            {
                userid
            },
            (err, list) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: '获"项目列表"信息出错',
                            error: err
                        }
                    });
                }
                resolve(list);
            }
        );
    });
}

function getProjectData(userid, projectid) {
    return getProject(userid, projectid)
        .then(project => {
            console.log('project: ', project);
            let projectList = [project.data];
            let episodeList = null;
            let projectIdList = projectList.reduce((pre, cur) => {
                pre.push(cur.id);
                return pre;
            }, []);
            // TODO: 改写getEpisodeList, 使其能查询projectid列表中的所有项目集
            return getEpisodeListViaPIDList(userid, projectIdList).then(
                v => {
                    // v is episode-list;
                    episodeList = v;
                    projectList.forEach(project => {
                        project.children = episodeList.find(
                            episode => episode.projectid === project.id
                        );
                    });
                    return getSceneDataForEpisode(userid, episodeList).then(
                        vv => {
                            let sceneList = vv;
                            episodeList.forEach(episode => {
                                episode.children = sceneList.find(
                                    scene => scene.episodeid === episode.id
                                );
                            });
                            return getShotDataForScene(userid, sceneList).then(
                                vvv => {
                                    let shotList = vvv;
                                    sceneList.forEach(scene => {
                                        scene.children = shotList.find(
                                            shot => shot.sceneid === scene.id
                                        );
                                    });
                                    return getTakeDataForShot(
                                        userid,
                                        shotList
                                    ).then(
                                        vvv => {
                                            let takeList = vvv;
                                            shotList.forEach(shot => {
                                                shot.children = takeList.find(
                                                    take =>
                                                        take.shotid === shot.id
                                                );
                                            });
                                            return {
                                                state: CODE.STATE_OK,
                                                data: projectList
                                            };
                                        },
                                        () => {
                                            return Promise.resolve({
                                                state: CODE.STATE_OK,
                                                data: project
                                            });
                                        }
                                    );
                                },
                                () => {
                                    return Promise.resolve({
                                        state: CODE.STATE_OK,
                                        data: project
                                    });
                                }
                            );
                        },
                        () => {
                            return Promise.resolve({
                                state: CODE.STATE_OK,
                                data: project
                            });
                        }
                    );
                },
                () => {
                    // without episode
                    return Promise.resolve({
                        state: CODE.STATE_OK,
                        data: project
                    });
                }
            );
        })
        .catch(e => {
            return Promise.reject(e);
        });
}

function getEpisodeListViaPIDList(userid, pidlist) {
    return new Promise(function(resolve, reject) {
        db.find(
            {
                mag: 'episode',
                userid,
                projectid: {
                    $in: pidlist
                }
            },
            (err, list) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: '获取"集"信息出错',
                            error: err
                        }
                    });
                }
                resolve(list);
            }
        );
    });
}
function getTakeDataForShot(userid, shotList) {
    let shotIDList = shotList.map(e => e.id);

    // shotid 也是独一无二的
    return new Promise(function(resolve, reject) {
        db.find(
            {
                mag: 'shot',
                userid,
                shotid: {
                    $in: shotIDList
                }
            },
            (err, list) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: '获取"次"信息出错',
                            error: err
                        }
                    });
                }
                resolve(list);
            }
        );
    });
}
function getShotDataForScene(userid, sceneList) {
    let sceneIDList = sceneList.map(e => e.id);

    // sceneid 也是独一无二的
    return new Promise(function(resolve, reject) {
        db.find(
            {
                mag: 'shot',
                userid,
                sceneid: {
                    $in: sceneIDList
                }
            },
            (err, list) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: '获取"镜"信息出错',
                            error: err
                        }
                    });
                }
                resolve(list);
            }
        );
    });
}
function getSceneDataForEpisode(userid, episodeList) {
    let episodIDList = episodeList.map(e => e.id);

    // episodeid 也是独一无二的
    return new Promise(function(resolve, reject) {
        db.find(
            {
                mag: 'scene',
                userid,
                episodeid: {
                    $in: episodIDList
                }
            },
            (err, list) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: '获取"场"信息出错',
                            error: err
                        }
                    });
                }
                resolve(list);
            }
        );
    });
}

/*****************************************************************************************************************/

function setProjectData(projectData) {
    let project = _.cloneDeep(projectData);
    let { userid } = project;
    // let projectid = project.id;
    let episodelist = project.children;
    let scenelist = [];
    let shotlist = [];
    let takelist = [];
    let episodeTasks = [];
    let sceneTasks = [];
    let shotTasks = [];
    let takeTasks = [];
    if (isValidArray(episodelist)) {
        delete project['children'];
        let episodeAmt = 0;
        episodelist.forEach(episode => {
            let list = episode.children;
            episodeAmt += list.length;
            // console.log('children amt: ', list.length);
            if (isValidArray(list)) {
                delete episode['children'];
                scenelist = scenelist.concat(list);
            }
            /* try {
                await updateEpisode(userid, episode);
            } catch (e) {
                console.log('e: ', e)
            } */
            episodeTasks.push(updateEpisode(userid, episode));
            // console.log(`episode:\n`, episode);
        });
        console.log('scene amount(++children.length): ', episodeAmt);
        let sceneAmt = 0;
        if (scenelist.length > 0) {
            scenelist.forEach(scene => {
                let list = scene.children;
                if (isValidArray(list)) {
                    delete scene['children'];
                    shotlist = shotlist.concat(list);
                }
                // await updateScene(userid, scene);
                sceneTasks.push(updateScene(userid, scene));
                // console.log(`scene:\n`, scene);
                sceneAmt++;
            });
            console.log('scene amount: ', sceneAmt);
        }
        if (shotlist.length > 0) {
            shotlist.forEach(shot => {
                let list = shot.children;
                if (isValidArray(list)) {
                    delete shot['children'];
                    takelist = takelist.concat(list);
                }
                // await updateShot(userid, shot);
                shotTasks.push(updateShot(userid, shot));
                console.log(`shot:\n`, shot);
            });
        }
        if (takelist.length > 0) {
            takelist.forEach(take => {
                // await updateTake(userid, take);
                takeTasks.push(updateTake(userid, take));
                console.log(`take:\n`, take);
            });
        }

        Promise.allSettled(episodeTasks)
            .then(eplist => {
                console.log(
                    'episods: ',
                    eplist.filter(i => i.state === 0).length
                );
            })
            .catch(e => {
                console.log('e:', e);
            });
        Promise.allSettled(sceneTasks)
            .then(sclist => {
                console.log('scenes: ', sclist.filter(i => i.state === 0).length);
            })
            .catch(e => {
                console.log('e:', e);
            });
        Promise.allSettled(shotTasks)
            .then(shlist => {
                console.log('shots: ', shlist.filter(i => i.state === 0).length);
            })
            .catch(e => {
                console.log('e:', e);
            });
        Promise.allSettled(takeTasks)
            .then(talist => {
                console.log('takes: ', talist.filter(i => i.state === 0).length);
            })
            .catch(e => {
                console.log('e:', e);
            });
    }
    return updateProject(userid, project);
}

/*****************************************************************************************************************/

function clearDB() {
    return new Promise(function(resolve, reject) {
        db.remove({}, { multi: true }, (err, amt) => {
            if (err) {
                reject({
                    state: CODE.STATE_ERROR,
                    message: MESSAGE.DB_ACCESS,
                    data: {
                        detail: 'Remove 数据出错',
                        error: err
                    }
                });
            }
            resolve({
                state: CODE.STATE_OK,
                data: {
                    amt
                }
            });
        });
    });
}

function getProject(userid, id) {
    return new Promise(function(resolve, reject) {
        db.findOne({ userid, mag: 'project', id }, (err, doc) => {
            if (err) {
                reject({
                    state: CODE.STATE_ERROR,
                    message: MESSAGE.DB_ACCESS,
                    data: {
                        detail: 'FindOne 数据出错',
                        error: err
                    }
                });
            }
            resolve({
                state: CODE.STATE_OK,
                data: doc
            });
        });
    });
}
function addProject(userid, project) {
    return new Promise(function(resolve, reject) {
        db.insert(
            { userid, mag: 'project', ...project, alive: true },
            (err, doc) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: 'Insert 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: CODE.STATE_OK,
                    data: doc
                });
            }
        );
    });
}

function updateProject(userid, project) {
    return new Promise(function(resolve, reject) {
        db.update(
            { userid, mag: 'project', id: project.id },
            { $set: project },
            { upsert: true },
            (err, amt) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: 'Update 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: CODE.STATE_OK,
                    data: {
                        amt
                    }
                });
            }
        );
    });
}
function getEpisodeList(userid, projectid) {
    return new Promise(function(resolve, reject) {
        db.find({ userid, mag: 'episode', projectid }, (err, doc) => {
            if (err) {
                reject({
                    state: CODE.STATE_ERROR,
                    message: MESSAGE.DB_ACCESS,
                    data: {
                        detail: 'FindOne 数据出错',
                        error: err
                    }
                });
            }
            resolve({
                state: CODE.STATE_OK,
                data: doc
            });
        });
    });
}
function getEpisode(userid, projectid, id) {
    return new Promise(function(resolve, reject) {
        db.findOne({ userid, mag: 'episode', projectid, id }, (err, doc) => {
            if (err) {
                reject({
                    state: CODE.STATE_ERROR,
                    message: MESSAGE.DB_ACCESS,
                    data: {
                        detail: 'FindOne 数据出错',
                        error: err
                    }
                });
            }
            resolve({
                state: CODE.STATE_OK,
                data: doc
            });
        });
    });
}
function addEpisode(userid, episode) {
    return new Promise(function(resolve, reject) {
        db.insert(
            { userid, mag: 'episode', ...episode, alive: true },
            (err, doc) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: 'Insert 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: CODE.STATE_OK,
                    data: doc
                });
            }
        );
    });
}

function updateEpisode(userid, episode) {
    return new Promise(function(resolve, reject) {
        db.update(
            {
                userid,
                mag: 'episode',
                projectid: episode.projectid,
                id: episode.id
            },
            { $set: episode },
            { upsert: true },
            (err, amt) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: 'Update 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: CODE.STATE_OK,
                    data: {
                        amt
                    }
                });
            }
        );
    });
}
function getSceneList(userid, projectid, episodeid) {
    return new Promise(function(resolve, reject) {
        db.find({ userid, mag: 'scene', projectid, episodeid }, (err, list) => {
            if (err) {
                reject({
                    state: CODE.STATE_ERROR,
                    message: MESSAGE.DB_ACCESS,
                    data: {
                        detail: 'FindOne 数据出错',
                        error: err
                    }
                });
            }
            resolve({
                state: CODE.STATE_OK,
                data: list
            });
        });
    });
}

function getScene(userid, projectid, episodeid, id) {
    return new Promise(function(resolve, reject) {
        db.findOne(
            { userid, mag: 'scene', projectid, episodeid, id },
            (err, doc) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: 'FindOne 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: CODE.STATE_OK,
                    data: doc
                });
            }
        );
    });
}
function addScene(userid, scene) {
    return new Promise(function(resolve, reject) {
        db.insert(
            { userid, mag: 'scene', ...scene, alive: true },
            (err, doc) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: 'Insert 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: CODE.STATE_OK,
                    data: doc
                });
            }
        );
    });
}

function updateScene(userid, scene) {
    return new Promise(function(resolve, reject) {
        db.update(
            {
                userid,
                mag: 'scene',
                projectid: scene.projectid,
                episodeid: scene.episodeid,
                id: scene.id
            },
            { $set: scene },
            { upsert: true },
            (err, amt) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: 'Update 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: CODE.STATE_OK,
                    data: {
                        amt
                    }
                });
            }
        );
    });
}

function getShotList(userid, projectid, episodeid, sceneid) {
    return new Promise(function(resolve, reject) {
        db.find(
            { userid, mag: 'shot', projectid, episodeid, sceneid },
            (err, doc) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: 'FindOne 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: CODE.STATE_OK,
                    data: doc
                });
            }
        );
    });
}

function getShot(userid, projectid, episodeid, sceneid, id) {
    return new Promise(function(resolve, reject) {
        db.findOne(
            { userid, mag: 'shot', projectid, episodeid, sceneid, id },
            (err, doc) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: 'FindOne 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: CODE.STATE_OK,
                    data: doc
                });
            }
        );
    });
}

function addShot(userid, shot) {
    return new Promise(function(resolve, reject) {
        db.insert({ userid, mag: 'shot', ...shot, alive: true }, (err, doc) => {
            if (err) {
                reject({
                    state: CODE.STATE_ERROR,
                    message: MESSAGE.DB_ACCESS,
                    data: {
                        detail: 'Insert 数据出错',
                        error: err
                    }
                });
            }
            resolve({
                state: CODE.STATE_OK,
                data: doc
            });
        });
    });
}
function updateShot(userid, shot) {
    return new Promise(function(resolve, reject) {
        db.update(
            {
                userid,
                mag: 'shot',
                projectid: shot.projectid,
                episodeid: shot.episodeid,
                sceneid: shot.sceneid,
                id: shot.id
            },
            { $set: shot },
            { upsert: true },
            (err, amt) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: 'Update 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: CODE.STATE_OK,
                    data: {
                        amt
                    }
                });
            }
        );
    });
}
function getTakeList(userid, projectid, episodeid, sceneid, shotid) {
    return new Promise(function(resolve, reject) {
        db.findOne(
            { userid, mag: 'take', projectid, episodeid, sceneid, shotid },
            (err, doc) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: 'FindOne 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: CODE.STATE_OK,
                    data: doc
                });
            }
        );
    });
}
function getTake(userid, projectid, episodeid, sceneid, shotid, id) {
    return new Promise(function(resolve, reject) {
        db.findOne(
            { userid, mag: 'take', projectid, episodeid, sceneid, shotid, id },
            (err, doc) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: 'FindOne 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: CODE.STATE_OK,
                    data: doc
                });
            }
        );
    });
}
function addTake(userid, take) {
    return new Promise(function(resolve, reject) {
        db.insert({ userid, mag: 'take', ...take, alive: true }, (err, doc) => {
            if (err) {
                reject({
                    state: CODE.STATE_ERROR,
                    message: MESSAGE.DB_ACCESS,
                    data: {
                        detail: 'Insert 数据出错',
                        error: err
                    }
                });
            }
            resolve({
                state: CODE.STATE_OK,
                data: doc
            });
        });
    });
}
function updateTake(userid, take) {
    return new Promise(function(resolve, reject) {
        db.update(
            {
                userid,
                mag: 'take',
                projectid: take.projectid,
                episodeid: take.episodeid,
                sceneid: take.sceneid,
                shotid: take.shotid,
                id: take.id
            },
            { $set: take },
            (err, amt) => {
                if (err) {
                    reject({
                        state: CODE.STATE_ERROR,
                        message: MESSAGE.DB_ACCESS,
                        data: {
                            detail: 'Update 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: CODE.STATE_OK,
                    data: {
                        amt
                    }
                });
            }
        );
    });
}

/*****************************************************************************************************************/

function exclude(list, sublist) {
    return list.reduce((pre, item) => {
        if (!sublist.includes(item)) {
            pre.push(item);
        }
        return pre;
    }, []);
}

/**
 *
 * @param {Object} listObj: { projectList, episodelist, scenelist, shotList, takeList }
 */
function construct(listObj) {
    let { projectList, episodeList, sceneList, shotList, takeList } = listObj;
    // console.log('takeList:\n', JSON.stringify(takeList));
    shotList.forEach(shot => {
        let { userid, projectid, episodeid, sceneid } = shot;
        let shotid = shot.id;
        shot.children = takeList.filter(take => {
            return (
                userid === take.userid &&
                projectid === take.projectid &&
                episodeid === take.episodeid &&
                sceneid === take.sceneid &&
                shotid === take.shotid
            );
        });
        takeList = exclude(takeList, shot.children);
    });

    // console.log('takeList:\n', JSON.stringify(takeList));
    // console.log('shotList:\n', JSON.stringify(shotList));
    sceneList.forEach(scene => {
        let { userid, projectid, episodeid } = scene;
        let sceneid = scene.id;
        scene.children = shotList.filter(shot => {
            return (
                userid === shot.userid &&
                projectid === shot.projectid &&
                episodeid === shot.episodeid &&
                sceneid === shot.sceneid
            );
        });
        shotList = exclude(shotList, scene.children);
    });
    // console.log('sceneList:\n', JSON.stringify(sceneList));
    episodeList.forEach(episode => {
        let { userid, projectid } = episode;
        let episodeid = episode.id;
        episode.children = sceneList.filter(scene => {
            return (
                userid === scene.userid &&
                projectid === scene.projectid &&
                episodeid === scene.episodeid
            );
        });
        sceneList = exclude(sceneList, episode.children);
    });
    // console.log('episodeList:\n', JSON.stringify(episodeList));

    if (isValidArray(projectList)) {
        projectList.forEach(project => {
            let userid = project.userid;
            let projectid = project.id;
            project.children = episodeList.filter(episode => {
                return (
                    userid === episode.userid && projectid === episode.projectid
                );
            });
            episodeList = exclude(episodeList, project.children);
        });
        return projectList;
    } else {
        let projectObj = {};
        //TODO: 保证都是同一个用户
        episodeList.forEach(episode => {
            let children = projectObj[episode.projectid];
            if (isValidArray(children)) {
                children.push(episode);
            } else {
                projectObj[episode.projectid] = [episode];
            }
        });
        // console.log('projectObj\n', projectObj);
        let keys = Object.keys(projectObj);
        projectList = [];
        keys.forEach(key => {
            projectList.push({
                id: key,
                children: projectObj[key]
            });
        });
    }
    return projectList;
}

function destruct(project) {
    let rawEpisodeList = project.children;
    let episodeList = [];
    let sceneList = [];
    let shotList = [];
    let takeList = [];
    let swapScenList = [];
    let swapShotList = [];
    episodeList = rawEpisodeList.reduce((pre, cur) => {
        if (isValidArray(cur.children)) {
            swapScenList = swapScenList.concat(cur.children);
            // swapScenList = [...swapScenList, ...cur.children];
            delete cur['children'];
        }
        pre.push(cur);
        return pre;
    }, []);
    sceneList = swapScenList.reduce((pre, cur) => {
        if (isValidArray(cur.children)) {
            swapShotList = swapShotList.concat(cur.children);
            delete cur['children'];
        }
        pre.push(cur);
        return pre;
    }, []);
    shotList = swapShotList.reduce((pre, cur) => {
        if (isValidArray(cur.children)) {
            takeList = takeList.concat(cur.children);
            delete cur['children'];
        }
        pre.push(cur);
        return pre;
    }, []);
    return {
        episodeList,
        sceneList,
        shotList,
        takeList
    };
}

/*****************************************************************************************************************/

module.exports = {
    initDB,
    clearDB,
    getSession,
    setSession,
    getSessionLite,
    getProjectList,
    getProjectData,
    setProjectData,
    getProject,
    addProject,
    updateProject,
    getEpisodeList,
    getEpisode,
    addEpisode,
    updateEpisode,
    getScene,
    getSceneList,
    addScene,
    updateScene,
    getShotList,
    getShot,
    addShot,
    updateShot,
    getTakeList,
    getTake,
    addTake,
    updateTake,
    destruct,
    construct
};
