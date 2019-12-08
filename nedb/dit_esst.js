module.exports = {
    getEpisodeDataViaProjectList
};

const db = require('./dit_crud');

function getEpisodeDataViaProjectList(projectList) {
    let tasks = [];
    projectList.forEach(p => {
        tasks.push(getEpisodeDataViaProject(p));
    });
    return Promise.allSettled(tasks).then(() => {
        return Promise.resolve({
            state: 0,
            data: projectList
        });
    });
}
function getEpisodeDataViaProject(project, deep) {
    let { userid, id } = project;
    return new Promise(function(resolve, reject) {
        db.find(
            {
                mag: 'scene',
                userid,
                projectid: id,
                alive: true
            },
            (err, docs) => {
                if (err) {
                    reject({
                        state: 1,
                        message: 'DB error',
                        data: {
                            detail: '获取"集"信息出错',
                            error: err
                        }
                    });
                }
                project.children = docs;
                if (deep) {
                    let taskList = [];
                    docs.forEach(episode => {
                        taskList.push(getSceneDataViaEpisode(episode, deep));
                    });
                    return Promise.allSettled(taskList);
                } else {
                    resolve({
                        state: 0,
                        data: docs
                    });
                }
            }
        );
    });
}
function getSceneDataViaEpisode(episode, deep) {
    let { userid, projectid, id } = episode;
    return new Promise(function(resolve, reject) {
        db.find(
            {
                mag: 'scene',
                userid,
                projectid,
                episodeid: id,
                alive: true
            },
            (err, docs) => {
                if (err) {
                    reject({
                        state: 1,
                        message: 'DB error',
                        data: {
                            detail: '获取"场"信息出错',
                            error: err
                        }
                    });
                }
                episode.children = docs;
                if (deep) {
                    let taskList = [];
                    docs.forEach(scene => {
                        taskList.push(getShotDataViaScene(scene, deep));
                    });
                    return Promise.allSettled(taskList);
                }
                resolve({
                    state: 0,
                    data: docs
                });
            }
        );
    });
}
function getShotDataViaScene(scene, deep) {
    let { userid, projectid, episodeid, id } = scene;
    return new Promise(function(resolve, reject) {
        db.find(
            {
                mag: 'shot',
                userid,
                projectid,
                episodeid,
                sceneid: id,
                alive: true
            },
            (err, docs) => {
                if (err) {
                    reject({
                        state: 1,
                        message: 'DB error',
                        data: {
                            detail: '获取"镜"信息出错',
                            error: err
                        }
                    });
                }
                scene.children = docs;
                if (deep) {
                    let taskList = [];
                    docs.forEach(shot => {
                        taskList.push(getTakeDataViaShot(shot, deep));
                    });
                    return Promise.allSettled(taskList);
                }
                resolve({
                    state: 0,
                    data: docs
                });
            }
        );
    });
}

function getTakeDataViaShot(shot) {
    let { userid, projectid, episodeid, sceneid, id } = shot;
    return new Promise(function(resolve, reject) {
        db.find(
            {
                mag: 'take',
                userid,
                projectid,
                episodeid,
                sceneid,
                shotid: id,
                alive: true
            },
            (err, docs) => {
                if (err) {
                    reject({
                        state: 1,
                        message: 'DB error',
                        data: {
                            detail: '获取"次"信息出错',
                            error: err
                        }
                    });
                }
                shot.children = docs;
                resolve({
                    state: 0,
                    data: docs
                });
            }
        );
    });
}
