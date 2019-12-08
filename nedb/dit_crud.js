/*globals __dirname */
const { isValidArray } = require('../utils/utils.js');
const Nedb = require('nedb');
const path = require('path');

let db = null;
let dbfile = path.resolve(__dirname, 'db');

function initDB() {
    db = new Nedb({
        filename: dbfile,
        autoload: true
    });
    return db;
}

function clearDB() {
    return new Promise(function(resolve, reject) {
        db.remove({}, { multi: true }, (err, amt) => {
            if (err) {
                reject({
                    state: 1,
                    message: 'DB Error',
                    data: {
                        detail: 'Remove 数据出错',
                        error: err
                    }
                });
            }
            resolve({
                state: 0,
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
                    state: 1,
                    message: 'DB Error',
                    data: {
                        detail: 'FindOne 数据出错',
                        error: err
                    }
                });
            }
            resolve({
                state: 0,
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
                        state: 1,
                        message: 'DB Error',
                        data: {
                            detail: 'Insert 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: 0,
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
            (err, amt) => {
                if (err) {
                    reject({
                        state: 1,
                        message: 'DB Error',
                        data: {
                            detail: 'Update 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: 0,
                    data: {
                        amt
                    }
                });
            }
        );
    });
}
function getEpisode(userid, projectid, id) {
    return new Promise(function(resolve, reject) {
        db.findOne({ userid, mag: 'episode', projectid, id }, (err, doc) => {
            if (err) {
                reject({
                    state: 1,
                    message: 'DB Error',
                    data: {
                        detail: 'FindOne 数据出错',
                        error: err
                    }
                });
            }
            resolve({
                state: 0,
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
                        state: 1,
                        message: 'DB Error',
                        data: {
                            detail: 'Insert 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: 0,
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
            (err, amt) => {
                if (err) {
                    reject({
                        state: 1,
                        message: 'DB Error',
                        data: {
                            detail: 'Update 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: 0,
                    data: {
                        amt
                    }
                });
            }
        );
    });
}

function getScene(userid, projectid, episodeid, id) {
    return new Promise(function(resolve, reject) {
        db.findOne(
            { userid, mag: 'scene', projectid, episodeid, id },
            (err, doc) => {
                if (err) {
                    reject({
                        state: 1,
                        message: 'DB Error',
                        data: {
                            detail: 'FindOne 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: 0,
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
                        state: 1,
                        message: 'DB Error',
                        data: {
                            detail: 'Insert 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: 0,
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
            (err, amt) => {
                if (err) {
                    reject({
                        state: 1,
                        message: 'DB Error',
                        data: {
                            detail: 'Update 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: 0,
                    data: {
                        amt
                    }
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
                        state: 1,
                        message: 'DB Error',
                        data: {
                            detail: 'FindOne 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: 0,
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
                    state: 1,
                    message: 'DB Error',
                    data: {
                        detail: 'Insert 数据出错',
                        error: err
                    }
                });
            }
            resolve({
                state: 0,
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
            (err, amt) => {
                if (err) {
                    reject({
                        state: 1,
                        message: 'DB Error',
                        data: {
                            detail: 'Update 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: 0,
                    data: {
                        amt
                    }
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
                        state: 1,
                        message: 'DB Error',
                        data: {
                            detail: 'FindOne 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: 0,
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
                    state: 1,
                    message: 'DB Error',
                    data: {
                        detail: 'Insert 数据出错',
                        error: err
                    }
                });
            }
            resolve({
                state: 0,
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
                        state: 1,
                        message: 'DB Error',
                        data: {
                            detail: 'Update 数据出错',
                            error: err
                        }
                    });
                }
                resolve({
                    state: 0,
                    data: {
                        amt
                    }
                });
            }
        );
    });
}
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

module.exports = {
    db,
    clearDB,
    initDB,
    getProject,
    addProject,
    updateProject,
    getEpisode,
    addEpisode,
    updateEpisode,
    getScene,
    addScene,
    updateScene,
    getShot,
    addShot,
    updateShot,
    getTake,
    addTake,
    updateTake,
    destruct,
    construct
};
