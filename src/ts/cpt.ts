/// <reference path="graph_node.ts" /> 


import graph_node = require('graph_node');

interface ICPTRow {
  conditions: string[];
  counts: number[];
}

interface ICPTHeader {
  conditions: string[];
  values: string[];
}

export interface ICPT {
  header: ICPTHeader;
  rows:   ICPTRow[];
}


export class CPT implements ICPT {
  public header:ICPTHeader;
  public rows:ICPTRow[] = [];

  private offsets: number[];

  // build a conditional prob table
  constructor( private node : graph_node.GraphNode
             , private parents: graph_node.GraphNode[] = []
             , sample: number[] = null) {

    if(parents.length == 0) {
      this.header = { conditions: [],  values: node.getValues()  }
      this.rows   = [{ conditions: [], counts: node.histogram().map((x) => x/node.length() ) }]
    } else {


      this.offsets = this.calc_offsets();

      // number of conditions = product of value lengths
      var conditions = parents.map( (p) => { 
        return p.getValues().length; }).reduce( (a, b) => { 
          return a * b; }, 1);
      var counts = new Array(conditions);
      
      var base_arr = new Array(node.getValues().length); 

      for (var i = 0; i < base_arr.length; i++) {
        base_arr[i] = 0; 
      }

      for (var i = 0; i < counts.length; i++) {
        counts[i] = base_arr.slice(); // copy
      }


      this.header = { conditions: parents.map((n) => n.getName()),
                      values: node.getValues()
                    };

      for (var i = 0; i < this.node.ndata.length; i++) {
        var index = this.index(
          this.parents.map((p) => { return p.ndata[i]; })
        );

        if(sample) {
          counts[index][node.ndata[i]] + sample[i];
        } else {
          counts[index][node.ndata[i]]++;
        }
      }

      var cond_table = this.conditionTable(conditions);

      var norm_counts = (counts : number[]) : number[] => {
        var sum = counts.reduce( (a,b) => a + b, 0);
        return counts.map( (x) => x / sum );
      }

      for(var i = 0; i < conditions; i++) {
        this.rows.push({ conditions: cond_table[i],
                         counts: norm_counts(counts[i])});
      }
    }
  }

  getTable() : ICPT {
    return { header: this.header, rows: this.rows };
  }

  // contstruct array for lookup function
  private calc_offsets( ) : number[] {
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
  private index(values: number[]) : number {
    var num:number = 0;

    for (var i = 0; i < this.parents.length; i++) {
      num += this.offsets[i] * values[i];
    }

    return num;
  }

  // inverse of index
  private unindex(id: number) : number[] {
    var values:number[] = [];

    for (var i = 0; i < this.parents.length; i++) {
      var current_val = Math.floor( id / this.offsets[i] );
      values.push(current_val);
      id -= current_val * this.offsets[i];
    }
    return values;
  }

  private conditionTable(numConditions) : string[][] {
    var table = [];

    for (var i = 0; i < numConditions; i++) {
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
