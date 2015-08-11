/// <reference path="graph_node.ts" /> 
/// <reference path="graph.ts" /> 

import Baby = require('babyparse');
import fs = require('fs');

import graph_node = require('./graph_node');
import graph = require('./graph');

fs.readFile('/home/mewalz/sample.tab', 'utf8', (err, dat) => { 
  if(err) { return throw err } ; 

  p = Baby.parse(dat, {header: true, delimiter: ' '});  

  var hash = {};
  p.meta.fields.forEach((f) => { hash[f] = []; });
  p.data.forEach((row) => {
    for(var field in row) {
      hash[field].push(row[field]);
    }
  });
  console.log(hash);

  g = new graph.Graph("hello world");
  for(var field in hash) { 
    g.addNode(new graph_node.GraphNode(field, hash[field]));
  }
  
  var nodes = g.getNodes();
  g.addEdge(nodes[0], nodes[3]);
  g.addEdge(nodes[1], nodes[3]);
  g.addEdge(nodes[2], nodes[3]);

  console.log(g);
  console.log(g.calculateCpt(nodes[3]));
);
