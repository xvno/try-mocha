/* globals describe, it */
console.log('mocha testing...');
const assert = require('assert');

const {
    initDB,
    clearDB,
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
    construct,
    destruct
} = require('../nedb/dit_crud');

const { isNull, isValidPlainObject, isValidArray } = require('../utils/utils');

describe('DIT', function() {
    describe('DB API', function() {
        initDB();
        let userid = 'tester';
        let projectid = 'Project-00001';
        let project = {
            userid,
            id: projectid,
            name: '大江大河'
        };
        let updatedProject = Object.assign({}, project, {
            name: '大江大海一箱啤酒'
        });
        describe('clearDB', function() {
            it('clearing: ', function() {
                return clearDB().then(v => {
                    // console.log('v: ', v);
                    assert(v.data && v.data.amt >= 0, 'should more than 0');
                });
            });
        });
        describe('Project 1', function() {
            it('getProjec', function() {
                return getProject(userid, projectid).then(v => {
                    // console.log('v: ', v);
                    assert(isNull(v.data), 'should return null');
                });
            });
            it('addProject', function() {
                return addProject(userid, project).then(v => {
                    // console.log('v: ', v);
                    assert(
                        isValidPlainObject(v.data),
                        'should return an object'
                    );
                });
            });
            it('updateProject', function() {
                return updateProject(userid, updatedProject).then(v => {
                    // console.log('v: ',v);
                    assert(v.data.amt === 1, 'should return 1 if updated');
                });
            });
            it('getProjec 2', function() {
                return getProject(userid, projectid).then(v => {
                    // console.log('v: ', v);
                    assert(
                        isValidPlainObject(v.data),
                        'should return a object'
                    );
                });
            });
        });
        let episodeid = 'Episode-0001';
        let episode = {
            id: episodeid,
            name: '大学教室',
            projectid,
            userid
        };
        let updatedEpisode = Object.assign({}, episode, { name: '大学操场' });

        describe('Episode', function() {
            it('getEpisode 1', function() {
                return getEpisode(userid, projectid, episodeid).then(v => {
                    assert(isNull(v.data), 'should return null');
                });
            });
            it('addEpisode', function() {
                return addEpisode(userid, episode).then(v => {
                    assert(isValidPlainObject(v.data), 'should be an object');
                });
            });
            it('updateEpisode', function() {
                return updateEpisode(userid, updatedEpisode).then(v => {
                    assert(v.data.amt == 1, 'should be 1');
                });
            });
            it('getEpisode 2', function() {
                return getEpisode(userid, projectid, episodeid).then(v => {
                    assert(isValidPlainObject(v.data), 'should be an object');
                });
            });
        });

        let sceneid = 'Scene-0001';
        let scene = {
            id: sceneid,
            name: '大学教室',
            userid,
            projectid,
            episodeid
        };
        let updatedScene = Object.assign({}, scene, { name: '接力赛跑' });

        describe('Scene', function() {
            it('getScene 1', function() {
                return getScene(userid, projectid, episodeid, sceneid).then(
                    v => {
                        assert(isNull(v.data), 'should return null');
                    }
                );
            });
            it('AddScene', function() {
                return addScene(userid, scene).then(v => {
                    assert(isValidPlainObject(v.data), 'should be an object');
                });
            });
            it('updateScene', function() {
                return updateScene(userid, updatedScene).then(v => {
                    assert(v.data.amt == 1, 'should be 1');
                });
            });
            it('getScene 2', function() {
                return getScene(userid, projectid, episodeid, sceneid).then(
                    v => {
                        assert(
                            isValidPlainObject(v.data),
                            'should be an object'
                        );
                    }
                );
            });
        });

        let shotid = 'Shot-0001';
        let shot = {
            id: shotid,
            userid,
            projectid,
            episodeid,
            sceneid,
            name: 'Shot-0001'
        };
        let updatedShot = Object.assign({}, shot, {
            name: 'updated Shot-0001'
        });
        describe('Shot', function() {
            it('getShot 1', function() {
                return getShot(
                    userid,
                    projectid,
                    episodeid,
                    sceneid,
                    shotid
                ).then(v => {
                    assert(isNull(v.data), 'should return null');
                });
            });
            it('AddShot', function() {
                return addShot(userid, shot).then(v => {
                    assert(isValidPlainObject(v.data), 'should be an object');
                });
            });
            it('updateShot', function() {
                return updateShot(userid, updatedShot).then(v => {
                    assert(v.data.amt == 1, 'should be 1');
                });
            });
            it('getShot 2', function() {
                return getShot(
                    userid,
                    projectid,
                    episodeid,
                    sceneid,
                    shotid
                ).then(v => {
                    assert(isValidPlainObject(v.data), 'should be an object');
                });
            });
        });

        let takeid = 'Take-0001';
        let take = {
            id: takeid,
            userid,
            projectid,
            episodeid,
            sceneid,
            shotid,
            name: 'Take-0001'
        };
        let updatedTake = Object.assign({}, take, {
            name: 'updated Take-0001'
        });
        describe('Take', function() {
            it('getTake 1', function() {
                return getTake(
                    userid,
                    projectid,
                    episodeid,
                    sceneid,
                    shotid,
                    takeid
                ).then(v => {
                    assert(isNull(v.data), 'should return null');
                });
            });
            it('AddTake', function() {
                return addTake(userid, take).then(v => {
                    assert(isValidPlainObject(v.data), 'should be an object');
                });
            });
            it('updateTake', function() {
                return updateTake(userid, updatedTake).then(v => {
                    assert(v.data.amt == 1, 'should be 1');
                });
            });

            it('getTake 2', function() {
                return getTake(
                    userid,
                    projectid,
                    episodeid,
                    sceneid,
                    shotid,
                    takeid
                ).then(v => {
                    assert(isValidPlainObject(v.data), 'should be an object');
                });
            });
        });
        let listObj = null;
        describe('Destruct', function() {
            let childrenTake = [take];
            // console.log('childrenTake:\n', childrenTake);
            let childrenShot = [
                Object.assign({}, shot, { children: childrenTake })
            ];
            // console.log('childrenShot:\n', childrenShot);
            let childrenScene = [
                Object.assign({}, scene, { children: childrenShot })
            ];
            // console.log('childrenScene:\n', childrenScene);
            let childrenEpisode = [
                Object.assign({}, episode, { children: childrenScene })
            ];
            // console.log('childrenEpisod:\n', childrenEpisode);
            let complex = Object.assign({}, project, {
                children: childrenEpisode
            });
            // console.log('complex:\n', complex);
            it('simple', function() {
                listObj = destruct(complex);
                // console.log(listObj);
                assert(
                    listObj &&
                        Object.keys(listObj).length === 4 &&
                        isValidArray(listObj.episodeList) &&
                        isValidArray(listObj.sceneList) &&
                        isValidArray(listObj.shotList) &&
                        isValidArray(listObj.takeList)
                );
            });
        });
        describe('Construct', function() {
            it('simple', function() {
                let ret = construct(listObj);
                // console.log('ret\n', ret);
                // console.log('ret\n', JSON.stringify(ret));
                assert(isValidArray(ret), 'Should be an array');
            });
        });
    });
});
