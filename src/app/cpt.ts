/// <reference path="graph_node.ts" /> 


import graph_node = require('graph_node');

export class CPT {

  private conditions:number; 
  private offsets:number[];
  public  counts:number[][];
  private node:graph_node.GraphNode;
  private parents:graph_node.GraphNode[];

  // build a conditional prob table
  constructor( node : graph_node.GraphNode
             , parents: graph_node.GraphNode[]) {
    this.node = node;
    this.parents = parents;
    this.offsets = this.calc_offsets();
    // number of conditions = product of value lengths
    this.conditions = parents.map( (p) => { 
      return p.getValues().length; }).reduce( (a, b) => { 
        return a * b; }, 1);
    this.counts = new Array(this.conditions);
    
    var base_arr = new Array(node.getValues().length); 
    for (var i = 0; i < base_arr.length; i++) {
      base_arr[i] = 0; 
    }

    for (var i = 0; i < this.counts.length; i++) {
      this.counts[i] = base_arr.slice(); // copy
    }


    for (var i = 0; i < this.node.ndata.length; i++) {
      var index = this.index(
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
  index(values: number[]) : number {
    var num:number = 0;

    for (var i = 0; i < this.parents.length; i++) {
      num += this.offsets[i] * values[i];
    }

    return num;
  }

  // inverse of index
  unindex(id: number) : number[] {
    var values:number[] = [];

    for (var i = 0; i < this.parents.length; i++) {
      var current_val = Math.floor( id / this.offsets[i] );
      values.push(current_val);
      id -= current_val * this.offsets[i];
    }
    return values;
  }

  conditionTable() : string[][] {
    var table = [];

    for (var i = 0; i < this.conditions; i++) {
      var indexes = this.unindex(i);
      var row = [];
      for (var j = 0; j < indexes.length; j++) {
        row.push(this.parents[j].getValues()[indexes[j]]);
      }
      table.push(row);
    } 

    return table;
  }


}
