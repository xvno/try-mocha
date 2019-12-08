const assert = require('assert');

describe('Sequence: ', function() {
    describe('one', function() {
        it('1', function() {
            assert(1 == 1, '1 equals to 1');
        });
        it('2', function(done) {
            setTimeout(() => {
                console.log('2', Date.now());
                done();
            }, 500);
        });
        it('3', function(done) {
            setTimeout(() => {
                console.log('3', Date.now());
                done();
            }, 100);
        });
    });
    describe('two', function() {
        it('21', function() {
            assert(1 == 1, '1 equals to 1');
        });
        it('22', function(done) {
            setTimeout(() => {
                console.log('22', Date.now());
                done();
            }, 500);
        });
        it('23', function(done) {
            setTimeout(() => {
                console.log('23', Date.now());
                done();
            }, 100);
        });
    });
    describe('true', function() {});
});

describe('Sequence: Promise', function() {
    describe('one', function() {
        it('p1', function() {
            assert(1 == 1, '1 equals to 1');
        });
        it('p2', function() {
            return new Promise(function(resolve, reject) {
                setTimeout(() => {
                    console.log('p2', Date.now());
                    resolve(true);
                }, 500);
            });
        });

        it('p3', function() {
            return new Promise(function(resolve, reject) {
                setTimeout(() => {
                    console.log('p3', Date.now());
                    resolve(true);
                }, 50);
            });
        });
    });
    describe('two', function() {
        it('p22', function() {
            assert(1 == 1, '1 equals to 1');
        });
        it('p23', function(done) {
            setTimeout(() => {
                console.log('p23', Date.now());
                done();
            }, 100);
        });
    });
    describe('true', function() {});
});
