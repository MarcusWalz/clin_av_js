/// <reference path="../app.d.ts" />
/// <reference path="../graph_node.ts" />
/// <reference path="../graph.ts" />
/// <reference path="../cpt.ts" />
/// <reference path="../../../tools/typings/mocha/mocha.d.ts" />
/// <reference path="../../../tools/typings/chai/chai.d.ts" />


import chai        = require('chai');
import graph_node  = require('../graph_node');
import graph       = require('../graph');
import cpt         = require('../cpt');

// fuck node
eval(require('fs').readFileSync('../aux_scripts/all.js', 'utf8'));
//console.log(collections);


var expect = chai.expect;


describe('Graph', () => {
  var in_column = ['1', '2', '3', '*', '3'];

  var gn1 = new graph_node.GraphNode('N1', in_column);
  var gn2 = new graph_node.GraphNode('N2', in_column);
  var gn3 = new graph_node.GraphNode('N3', in_column);
  var gn4 = new graph_node.GraphNode('N4', in_column);
  var gn5 = new graph_node.GraphNode('N5', in_column);

  console.log(new cpt.CPT(gn1, [gn2,gn3,gn4]));

});
