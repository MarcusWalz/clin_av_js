/// <reference path="../graph.ts" />
/// <reference path="../../../tools/typings/mocha/mocha.d.ts" />
/// <reference path="../../../tools/typings/chai/chai.d.ts" />


import chai  = require('chai');
import graph = require('../graph');

var expect = chai.expect;

describe('Graph Tests', () => {

  
  describe('GraphNode', () => {
      var in_column = ['1', '2', '3', '*', '3'];
      var g = new graph.GraphNode("Hello", in_column);
      it('should have length 5', (done) => {
        expect(g.length()).to.equals(5);
        done();
      }); 
      it('.getMissingVal() should be null', (done) => {
        expect(g.getMissingVal()).to.be.null;
        done();
      });
      it('.getValues() should output in same order recieved', (done) => {
        expect(g.getValues()).to.eql(["1", "2", "3", "*"]);
        done();
      });
      it('.getMissingVal() should be set to *', (done) => {
        g.setMissingVal("*");
        expect(g.getMissingVal()).to.equals('*');
        done();
      });
      it('.getValues() should output missing first', (done) => {
        expect(g.getValues()).to.eql(["*", "1", "2", "3"]);
        done();
      });
      it('.getColumn() should be equal to input column', (done) => {
        expect(g.getColumn()).to.eql(in_column);
        done();
      });
  });
});
