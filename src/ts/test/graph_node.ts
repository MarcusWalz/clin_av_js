/// <reference path="test.d.ts" />
/// <reference path="../graph_node.ts" />


import chai       = require('chai');
import graph_node = require('../graph_node');

var expect = chai.expect;

describe('Graph Node', () => {
  var in_column = ['1', '2', '3', '*', '3'];
  var g = new graph_node.GraphNode('Hello', in_column);

  it('should have name', (done) => {
    expect(g.getName()).to.equals('Hello');
    done();
  }); 

  it('name should be changeable', (done) => {
    g.setName('Change');
    expect(g.getName()).to.equals('Change');
      done();
    });

    it('should have length equal to input column', (done) => {
      expect(g.length()).to.equals(in_column.length);
      done();
    }); 

    it('.getMissingVal() should be null', (done) => {
      expect(g.getMissingVal()).to.be.null;
      done();
    });

    it('.getValues() should output in same order recieved', (done) => {
      expect(g.getValues()).to.eql(['1', '2', '3', '*']);
      done();
    });

    it('.getMissingVal() should be set to *', (done) => {
      g.setMissingVal('*');
      expect(g.getMissingVal()).to.equal('*');
      done();
    });

    it('.getValues() should output missing first', (done) => {
      expect(g.getValues()).to.eql(['*', '1', '2', '3']);
      done();
    });

    it('.getColumn() should be equal to input column', (done) => {
      expect(g.getColumn()).to.eql(in_column);
      done();
    });

    it('.getCell() should output the correct cell', (done) => {
      for (var i:number = 0; i < in_column.length; i++) { 
        expect(g.getCell(i)).to.equal(in_column[i]);
      }
      done();
    });

    it('.getCell() should throw RangeError', (done) => {
      expect( () => { g.getCell(in_column.length); }
          ).to.throw(RangeError);
      done();
    });

});
