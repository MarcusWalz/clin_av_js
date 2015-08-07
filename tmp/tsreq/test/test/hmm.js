/// <reference path="../tools/typings/mocha/mocha.d.ts" />
/// <reference path="../tools/typings/chai/chai.d.ts" />
/// <reference path="../src/app/node.ts" />
var chai = require('chai');
console.log("hello");
var expect = chai.expect;
describe('simple test', function () {
    var t = new Graph.GraphNode("Hello", ["1", "2", "3", "*"]);
    describe('1+1', function () {
        it('should be 2', function (done) {
            expect(1 + 1).to.equals(2);
            done();
        });
    });
});
