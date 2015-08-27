/// <reference path="test.d.ts" />
/// <reference path="../graph_node.ts" />
/// <reference path="../graph.ts" />
/// <reference path="../cpt.ts" />


import chai        = require('chai');
import graph_node  = require('../graph_node');
import graph       = require('../graph');
import cpt         = require('../cpt');


var expect = chai.expect;

console.log("why am I here!!!");
console.trace();


describe('CPT', () => {
  var col1 = ['1', '2', '3', '4', '5'];
  var col2 = ['a', 'b', 'c', 'a', 'a'];
  var col3 = ['t', 'f', 't', 't', 't'];

  var gn1 = new graph_node.GraphNode('N1', col1);
  var gn2 = new graph_node.GraphNode('N2', col2);
  var gn3 = new graph_node.GraphNode('N3', col3);

  // console.log(new cpt.CPT(gn1, [gn2, gn3]).conditionTable());

  it('sum of counts should be eq. number of data points', (done) => {
    var table = new cpt.CPT(gn1, [gn2, gn3]).getTable(); 

    var counts = 0; 
    table.rows.forEach( (row) => 
        row.counts.forEach((c2) => counts=counts + c2) );

    console.log("Counts: " + counts);

    expect(counts).to.be.equal(5);
    done();
  });

  it('should have a [] conditon if no parents',
      (done) => 
  { var table = new cpt.CPT(gn1).getTable(); 
    expect(table.header.conditions).to.be.empty;
    expect(table.rows[0].conditions).to.be.empty;
    done();
  });

  it('should output the lookup table');
  it('should have an addition opperation');
  it('should be divided by an integer');
  it('should be dividable');
  it('should output probs. to');

});
