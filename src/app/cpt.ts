/// <reference path="graph_node.ts" /> 


import graph_node = require('graph_node');

export class CPT {

  private conditions:number; 
  private offsets:number[];
  private counts:number[][];
  private node:graph_node.GraphNode;
  private parents:graph_node.GraphNode[];

  // build a conditional prob table
  constructor( node : graph_node.GraphNode
             , parents: graph_node.GraphNode[]) {
    this.node = node;
    this.parents = parents;
    this.offsets = this.calc_offsets();
    // number of conditions = product of value lengths
    this.conditions = parents.map((p) => p.getValues().length)
                             .reduce((a,b) => a*b, 1);
    this.counts = new Array(this.conditions);
    
    var base_arr = new Array(node.getValues().length); 
    for (var i = 0; i < base_arr.length; i++) {
      base_arr[i] = 0; 
    }

    for (var i = 0; i < this.counts.length; i++) {
      this.counts[i] = base_arr.slice(); // copy
    }


    for(var i = 0; i < this.node.ndata.length; i++) {
      var index = this.lookupIdx(
        this.parents.map((p) => { return p.ndata[i]; })
      );

      this.counts[index][node.ndata[i]]++;
    }

  }

  // contstruct array for lookup function
  private calc_offsets ( ) : number[] {
    var offset = new Array(this.parents.length);
    for (var i = 0 ; i < this.parents.length; i++) {
      offset[i] = 1;
      for (var j = i + 1; j < this.parents.length; j++) {
        offset[i] *= this.parents[j].getValues().length;
      }
    }
    return offset;
  }

  // find the index by taking cross-product of valuess and offset arrays
  lookupIdx(values: number[]) : number {
    var num:number = 0;

    for (var i = 0; i < this.parents.length; i++) {
      num += this.offsets[i] * values[i];
    }

    return num;
  }

}
