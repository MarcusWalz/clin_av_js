/// <reference path="../graph_node.ts" />
/// <reference path="../graph.ts" />
/// <reference path="../../../tools/typings/mocha/mocha.d.ts" />
/// <reference path="../../../tools/typings/chai/chai.d.ts" />


import chai        = require('chai');
import graph_node  = require('../graph_node');
import graph       = require('../graph');
import collections = require('../collections');


var expect = chai.expect;


describe('Graph', () => {
  var in_column = ['1', '2', '3', '*', '3'];

  var gn1 = new graph_node.GraphNode('N1', in_column);
  var gn2 = new graph_node.GraphNode('N2', in_column);
  var gn3 = new graph_node.GraphNode('N3', in_column);
  var gn4 = new graph_node.GraphNode('N4', in_column);

  var all_gn = [gn1, gn2, gn3, gn4];

  var g = new graph.Graph('test.txt', [gn1, gn2]);

  it('should have name', (done) => {
    expect(g.getName()).to.equals('test.txt');
    done();
  }); 

  it('.getName should print name', (done) => {
    expect(g.getName()).to.equals('test.txt');
    done();
  }); 

  it('.setName should change it', (done) => {
    g.setName('penis');
    expect(g.getName()).to.equals('penis');
    done();
  });

  it('.getNode should lookup node', (done) => {
    expect(g.getNode(gn1.getName())).to.equal(gn1);
    done();
  });

  it('.getNode should return null, if node dne', (done) => { 
    expect(g.getNode(gn3.getName())).to.be.null;
    done();
  });

  it('.addNode should be able to add unique node', (done) => {
    g.addNode(gn3);
    expect(g.getNode(gn3.getName())).to.not.be.null;
    done();
  });

  it('.addNode should throw error when adding duplicate node', (done) => {
    expect(() => { g.addNode(gn3); }).to.throw( Error);
    done();
  });

  it('.deleteNode should delete the correct node', (done) => {
    g.deleteNode(gn3.getName()); 
    expect(g.getNode(gn3.getName())).to.be.null;
    expect(g.getNode(gn1.getName())).to.not.be.null;
    expect(g.getNode(gn2.getName())).to.not.be.null;
    done();
  });

  it('.hasEdge should return false if edge dne', (done) => {
    expect(g.hasEdge(gn1.getName(), gn2.getName())).to.be.false;
    done();
  });

  it('.addEdge should create a new edge', (done) => {
    g.addEdge(gn1.getName(), gn2.getName());
    expect(g.getEdges()).to.be.eql([[gn1.getName(), gn2.getName()]]);
    expect(g.hasEdge(gn1.getName(), gn2.getName())).to.be.true;
    done();
  });

  it('.deleteEdge should delete an edge', (done) => {
    g.deleteEdge(gn1.getName(), gn2.getName());
    expect(g.hasEdge(gn1.getName(), gn2.getName())).to.be.false;
    done();
  });


});
