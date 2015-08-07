/// <reference path="./test.d.ts" />
var chai = require('chai');
//import Graph = module('graph');
console.log("hello");
var expect = chai.expect;
describe('simple test', function () {
    //  var t = new Graph.GraphNode("Hello", ["1","2","3","*"]);
    describe('1+1', function () {
        it('should be 2', function (done) {
            expect(1 + 1).to.equals(2);
            done();
        });
    });
});
