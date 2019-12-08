module.exports = {
    initDB,
    putDoc,
    getDocList,
    getDoc,
    updateDoc,
    removeDoc,
    clearDB
};

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

function putDoc(doc) {
    return new Promise(function(resolve, reject) {
        db.insert(doc, (err, d) => {
            if (err) {
                reject(err);
            }
            resolve(d);
        });
    });
}
function getDoc(query) {
    return new Promise(function(resolve, reject) {
        db.findOne({ id: query.id }, (err, d) => {
            if (err) {
                reject(err);
            }
            resolve(d);
        });
    });
}
function getDocList() {
    return new Promise(function(resolve, reject) {
        db.find({}, (err, d) => {
            if (err) {
                reject(err);
            }
            resolve(d);
        });
    });
}

function clearDB() {
    return new Promise(function(resolve, reject) {
        db.remove({}, { multi: true }, function(err, amt) {
            err ? reject(err) : resolve({ amt });
        });
    });
}

function updateDoc(query, doc) {
    return new Promise(function(resolve, reject) {
        db.update(query, doc, { upsert: true }, (err, amt) => {
            err ? reject(err) : resolve({ amt });
        });
    });
}
function removeDoc(query) {
    return new Promise(function(resolve, reject) {
        db.remove(query, (err, amt) => {
            err ? reject(err) : resolve({ amt });
        });
    });
}
