// <reference path="test.d.ts" />
/// <reference path="../graph_node.ts" />
/// <reference path="../graph.ts" />
/// <reference path="../bnm.ts" />

import chai        = require('chai');
import graph_node  = require('../graph_node');
import graph       = require('../graph');
import bnm         = require('../bnm');


var expect = chai.expect;
// var it = chai.it;

describe('BNM', () => {
  var col1 = ['1', '1', '0', '0'];
  var col2 = ['1', '0', '1', '0'];

  var gn1 = new graph_node.GraphNode('a', col1);
  var gn2 = new graph_node.GraphNode('b', col2);

  var g = new graph.Graph('hello', [gn1, gn2]);
  g.addEdge(gn1, gn2);

  var output = [
    {'a': '1', 'b': '1'}
  , {'a': '1', 'b': '0'}
  , {'a': '0', 'b': '1'}
  , {'a': '0', 'b': '0'}
  ];

  it('should create an output table just like input', (done) => {
    var b = new bnm.BNM(g);
    console.log(b.bnm);
    console.log(b.create_avatars(4));
    expect(b.create_avatars(4)).to.eql(output);
    done();
  });
});
