/// <reference path="test.d.ts" />
/// <reference path="../graph_node.ts" />
/// <reference path="../graph.ts" />
/// <reference path="../cpt.ts" />


import chai        = require('chai');
import graph_node  = require('../graph_node');
import graph       = require('../graph');
import cpt         = require('../cpt');

// fuck node
// eval(require('fs').readFileSync('../aux_scripts/all.js', 'utf8'));
//console.log(collections);


var expect = chai.expect;


describe('CPT', () => {
  var col1 = ['1', '2', '3', '4', '5'];
  var col2 = ['a', 'b', 'c', 'a', 'a'];
  var col3 = ['t', 'f', 't', 't', 't'];

  var gn1 = new graph_node.GraphNode('N1', col1);
  var gn2 = new graph_node.GraphNode('N2', col2);
  var gn3 = new graph_node.GraphNode('N3', col3);

  console.log(new cpt.CPT(gn1, [gn2, gn3]));
  console.log(new cpt.CPT(gn1, [gn2, gn3]).conditionTable());

  it('Should work without parents'), (done) => {

  });
  it('should work with only 1 condition', (done) => {
    var c = new cpt.CPT(gn1, [gn2]);
    done();
  });

  it('sum of counts should be eq. number of data points', (done) => {
    var c = new cpt.CPT(gn1, [gn2, gn3]); 

    var flat = [];
    flat = flat.concat.apply([], c.counts);
    var entries = flat.reduce( (a, b) => { return a + b; } );
    expect(entries).to.be.equal(gn1.length());
    done();

  });

  it('index and unindex should be inverses', (done) => {
    var c = new cpt.CPT(gn1, [gn2, gn3]); 
    for (var i = 0; i < 6; i++) {
      expect(c.index(c.unindex(i))).to.equal(i);
    }
    done();
  });
  it('should output the lookup table');
  it('should have an addition opperation');
  it('should be divided by an integer');
  it('should be dividable');
  it('should output probs. to');

});
