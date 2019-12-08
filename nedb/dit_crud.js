/*globals __dirname */
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
    updateScene
};
