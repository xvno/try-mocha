/* globals before, describe, it, beforeEach */

const assert = require('assert');
const { init } = require('./diff-patch/diff');
const { traversGet } = require('../utils/utils');
const { traversSet, patch } = require('./diff-patch/traversSet');
const {
    isValidPlainObject,
    isValidKeyArray,
    isValidArray,
    isValidNumber,
    isValidSymbol,
    isValidObject,
    isValidStringArg,
    isValidString,
    isValidFunction,
    isValidType,
    getType
} = require('../utils/types');

const {
    initDB,
    putDoc,
    getDoc,
    getDocList,
    updateDoc,
    removeDoc,
    clearDB
} = require('./crud');

describe('CRUD', function() {
    let db = null;
    describe('Init DB', function() {
        it('# invoke initDB', function() {
            db = initDB();
            assert(isValidObject(db), 'Should get non-error result');
        });
    });
    describe('Query db:', function() {
        it('# get {id: 1, name: test}', function() {
            getDoc({ id: 1, name: 'test' })
                .then(v => {
                    console.log('v: ', v);
                    return assert(
                        v && v.id === 1,
                        'Query result should be one doc with id = 1'
                    );
                })
                .catch(e => {
                    return Promise.reject(e);
                });
        });
    });
    describe('Add data:', function() {
        it('# put {id: 1, name: test}', function() {
            return putDoc({ id: 1, name: 'test' })
                .then(v => {
                    assert(v, 'Should return 1');
                })
                .catch(e => new Promise.reject(e));
        });
    });
    describe('GetDocList data:', function() {
        it('# get all docs', function() {
            return getDocList()
                .then(v => {
                    assert(isValidArray(v), 'Should return an array of docs');
                })
                .catch(e => Promise.reject(e));
        });
    });

    describe('updateDoc data:', function() {
        it('# update one which has id 1', function() {
            return updateDoc(
                { id: 1, _id: 'VY1vXgZR5oS3ileZ' },
                { $set: { name: 'updated' } }
            )
                .then(v => {
                    assert(v.amt === 1, 'Should return {amt: 1}');
                })
                .catch(e => Promise.reject(e));
        });
        it('# update one which has id 1, and set its friends with [{name: shuxin, id: 2}, {name: guoxing, id: 3}]', function() {
            return updateDoc(
                { id: 1, _id: 'o7mrYgmE3drfehiC' },
                {
                    $set: {
                        friends: [
                            { name: 'shuxin', id: 2 },
                            { name: 'guoxing', id: 3 }
                        ]
                    }
                }
            )
                .then(v => {
                    assert(v.amt === 1, 'Should return {amt: 1}');
                })
                .catch(e => Promise.reject(e));
        });

        it('# update one which has id 1, and set its senior of classmates with [{name: shuxin, id: 2}]', function() {
            return updateDoc(
                { id: 1, _id: 'o7mrYgmE3drfehiC' },
                {
                    $set: {
                        'classmates.senior': [{ name: 'shuxin', id: 2 }]
                    }
                }
            )
                .then(v => {
                    assert(v.amt === 1, 'Should return {amt: 1}');
                })
                .catch(e => Promise.reject(e));
        });

        it('# update one classmates.senior.id = 2 with classmates.senior.nickname = 舒老先生', function() {
            return updateDoc(
                { 'classmates.senior.id': 2 },
                {
                    $set: {
                        'classmates.senior.{id=2}.nickname': '舒老先生'
                    }
                }
            )
                .then(v => {
                    assert(v.amt === 1, 'Should return {amt: 1}');
                })
                .catch(e => Promise.reject(e));
        });

        it('# update one classmates.senior.id = 2 with pulling out subdoc with id = 3', function() {
            return updateDoc(
                { 'classmates.senior.id': 2 },
                {
                    $pull: {
                        'freinds.id': 3
                    }
                }
            )
                .then(v => {
                    assert(v.amt === 1, 'Should return {amt: 1}');
                })
                .catch(e => Promise.reject(e));
        });
    });
    //removeDoc

    /*     describe('removeDoc data:', function() {
        it('# remove any data with name === `updated`', function() {
            return removeDoc({ name: 'updated' })
                .then(v => {
                    assert(v.amt >= 0, 'Should return amt >= 0');
                })
                .catch(e => Promise.reject(e));
        });
    });

    describe('clearDB data:', function() {
        it('# remove any data', function() {
            return clearDB()
                .then(() => {
                    return getDocList().then(v => {
                        assert(
                            isValidArray(v) && v.length === 0,
                            'should return []'
                        );
                    });
                })
                .catch(e => Promise.reject(e));
        });
    }); */
});

let baseTS = Date.now();
let local = {
    id: 1000000000000,
    name: 'project-1',
    ts: baseTS - 2000,
    children: [
        {
            id: 100000000,
            name: 'scene-1',
            children: [
                {
                    id: 100000,
                    name: 'shot-1',
                    children: [{ id: 1000, name: 'take-1' }]
                },
                {
                    id: 200000,
                    name: 'shot-2',
                    children: [{ id: 1000, name: 'take-1' }]
                }
            ]
        }
    ]
};

let remote = {
    id: 1000000000000,
    name: 'project-1',
    ts: baseTS - 1000,
    tsmod: baseTS,
    mag: 'project',
    children: [
        {
            id: 100000000,
            name: 'scene-1',
            mag: 'scene',
            children: [
                {
                    id: 100000,
                    name: 'shot-1',
                    pm: 'shut-up',
                    children: [{ id: 1000, name: 'take-1' }]
                },
                {
                    id: 200000,
                    name: 'shot-2',
                    children: [
                        { id: 1000, name: 'take-1' },
                        { id: 2000, name: 'take-2' }
                    ]
                }
            ]
        },
        {
            id: 200000000,
            name: 'scene-2',
            children: [
                {
                    id: 100000,
                    name: 'shot-1',
                    children: [{ id: 1000, name: 'take-1' }]
                }
            ]
        }
    ]
};

describe('diff-patch: ', function() {
    describe('diff', function() {
        it('# get patch of remote - local', function() {
            let diff = init();
            let ops = diff(remote, local);
            assert(ops.length > 0);
        });
        it('# get patch of local - remote', function() {
            let diff = init();
            let ops = diff(local, remote);
            assert(ops.length > 0);
        });
    });

    let obj = null;

    describe('# traversGet', function() {
        this.beforeEach('', function() {
            obj = Object.assign({}, local);
        });
        describe('single part', function() {
            it('# id', function() {
                assert(traversGet(obj, 'id') === obj.id);
            });
            it('# name', function() {
                assert(traversGet(obj, 'name') === obj.name);
            });
        });
        describe('double parts', function() {
            it('# children.0', function() {
                assert(traversGet(obj, 'children.0') === obj.children[0]);
            });
            it('# children.1', function() {
                assert(traversGet(obj, 'children.1') === obj.children[1]);
            });
        });
        describe('multiple parts', function() {
            it('# children.0.id', function() {
                assert(traversGet(obj, 'children.0.id') === obj.children[0].id);
            });
            it('# children.1.name', function() {
                assert(
                    traversGet(obj, 'children.0.children.0.name') ===
                        obj.children[0].children[0].name
                );
            });
        });
    });

    describe('# traversSet', function() {
        beforeEach('', function() {
            obj = Object.assign({}, local);
        });
        it('should set depth of 1', function() {
            let name = 'test-1';
            traversSet(obj, 'name', name);
            assert(obj.name === name);
        });
        it('should set depth of 2', function() {
            traversSet(obj, 'children.0', 0);
            assert(obj.children[0] === 0);
        });
        it('should set depth of 3', function() {
            let name = 'test1-children1';
            traversSet(obj, 'children.1.name', name);
            assert(obj.children[1].name === name);
        });
        it('should set depth of any', function() {
            let name = 'test1-children1-child-0';
            traversSet(obj, 'children.1.children.0.name', name);
            assert(obj.children[1].children[0].name === name);
        });
    });

    describe('patch: ', function() {
        let ops = null;
        let iqiyi,
            app = null;
        before(function() {
            iqiyi = Object.assign({}, remote);
            app = Object.assign({}, local);
        });
        it('# get patch: iqiyi - local', function() {
            let diff = init();
            ops = diff(iqiyi, app);
            assert(ops.length > 0);
        });

        it('# patch and diff again', function() {
            patch(app, ops);
            let diff = init();
            ops = diff(iqiyi, app);
            assert(ops.length === 0, 'ops still exist');
        });
    });
});

describe.only('Promise', function() {
    it('# Promise.all', function() {
        let ret = [];
        let plist = [];

        let len = 2;
        for (let i = 0; i < len; i++) {
            plist.push(
                new Promise(function(resolve, reject) {
                    let num = parseInt(Math.random() * 100);
                    ret[i] = num;
                    if (num % 2 === 0) {
                        resolve(num);
                    }
                    reject(num);
                })
            );
        }
        return Promise.allSettled(plist).then(v => {
            console.log('v: ', v);
            assert(v.length === 2)
        });
    });
});
