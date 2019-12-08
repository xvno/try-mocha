const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Nedb = require('nedb');
let db = null;

const dbPath = path.resolve(__dirname, './db');
const { traversSet } = require('../test/traversSet');

before(function() {
    let pre = new Promise(function(resolve, reject) {
        fs.stat(dbPath, (err, stats) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.writeFile(dbPath, '', function(err, data) {
                        if (err) {
                            console.log('err: ', err);
                            reject('error: writeFile');
                        }
                        console.log('success: db file created sucessfully!');
                        resolve(true);
                    });
                }
                reject('err: othe error:\n', err);
            }
            resolve(true);
        });
    });
    pre.then(v => {
        db = new Nedb({
            // filename: dbPath,
            filename: dbPath,
            autoload: true
        });
        return db;
    }).catch(r => {
        console.log('Got error:\n', r);
    });
});
let obj = {
    user: 'test',
    id: 1,
    children: [1, { id: 'c1', name: 'children-1' }]
};

describe('db', function() {
    describe('# insertUserData', function() {
        it('should get the same id', function() {
            return new Promise(function(resolve, reject) {
                db.insert(obj, (err, doc) => {
                    if (err || doc.id !== obj.id) {
                        reject(false);
                    }
                    obj.ref = doc._id;
                    resolve(true);
                });
            });
        });
    });
    describe('# getUserList', function() {
        it('should get only one doc', function() {
            return new Promise(function(resolve, reject) {
                let condition = {
                    user: obj.user,
                    id: obj.id,
                    _id: obj.ref
                };
                db.find(condition, function(err, docs) {
                    if (err) {
                        reject(err);
                    }
                    resolve(docs);
                });
            }).then(
                v => {
                    assert(1 === v.length);
                },
                r => {
                    return Promise.reject(r);
                }
            );
        });
    });
    describe('# updateUser', function() {
        // before(function (done) {
        //     db.remove({}, {multi: true}, function (e, amt) {
        //         done()
        //     })
        // })
        it('should get one modified doc', function() {
            return new Promise(function(resolve, reject) {
                let condition = {
                    user: obj.user,
                    id: obj.id
                };
                db.update(
                    condition,
                    { $set: { id: 2 } },
                    { upsert: false },
                    function(e, amt) {
                        console.log(e);
                        console.log(amt);
                        if (e) {
                            reject(e);
                        }
                        resolve(amt);
                    }
                );
            });
        });
    });
});
