'use strict';

var expect = chai.expect;

describe('try.js > hey', function() {
    describe('customIndex.values', function() {
        it('should be an object', function () {
            expect(customIndex.values).to.be.a('object');
        });
    });
});