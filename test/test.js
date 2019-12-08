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
    updateScene
} = require('../nedb/dit_crud');
console.log('before');
const { isNull, isValidPlainObject } = require('../utils/utils');

describe('DIT', function() {
    describe('DB API', function() {
        initDB();
        let userid = 'tester';
        let projectid = 'Project-00001';

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
                return addProject(userid, {
                    id: projectid,
                    name: '大江大河'
                }).then(v => {
                    // console.log('v: ', v);
                    assert(
                        isValidPlainObject(v.data),
                        'should return an object'
                    );
                });
            });
            it('updateProject', function() {
                return updateProject(userid, {
                    id: projectid,
                    name: '大江大海一箱啤酒'
                }).then(v => {
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
            projectid
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
    });
});
