/// <references path="graph.ts" />
/// <references path="graph_node.ts" />
/// <references path="cpt.ts" />

import graph = require('graph');
import graph_node = require('graph_node');
import cpt   = require('cpt');


// Tree struct for BNM
export class IBNM {
  column: string; // name of node
  value: string;  // value
  prob:  number;  // p(value)
  children: IBNM[]; 
}

export class BNM {
  public bnm:IBNM[];

  constructor(graph : graph.Graph) {
    // TODO Catch and report error if graph is not acylclic
    var nodes = graph.topSort();
    var prob_tables = nodes.map(
        (n) => graph.calculateCpt(n)
    );

    this.bnm = this.build_bnm(nodes, prob_tables, {});
  }

  private build_bnm(
        rem_nodes : graph_node.GraphNode[]
      , rem_cpts  : cpt.ICPT[]
      , scope // dictionary of instantiated values
      ) : IBNM[] {

    if(rem_nodes.length == 0) {
      return [];
    }
    
    var node = rem_nodes[0];
    var cpt  = rem_cpts[0];

    // cut out the first elem
    rem_nodes = rem_nodes.slice(1);
    rem_cpts = rem_cpts.slice(1);

    // find the probs based on scope
    var my_values = cpt.header.values;
    var my_probs = [];
    if(cpt.header.conditions === []) {
      my_values=cpt.header.values;
      my_probs=cpt.rows[0].counts;
    } else {
      var my_row:string[] = [];
      cpt.header.conditions.forEach( (cond) => {
        if (scope[cond]) {
          my_row.push(scope[cond]);
        } else {
          throw new Error("Scope issue, shouldn't happen");
        }
        return true;
      });
      
      var index:number;

      for(var i = 0; i < cpt.rows.length; i++) {
        var found: boolean; 
        for(var j = 0; j < cpt.header.conditions.length; j++) {
          if (cpt.rows[i].conditions[j] != my_row[j]) { 
            found = false;
            break;
          }
          else {
            found = true;
          }
        }
        if(found) {
          index = i;
          break;
        }
      }
      if(index) {
        my_probs = cpt.rows[index].counts;
      } else {
        throw new Error("cpt malformed");
      }
    }

    // now build a dict
    var probs = {};
    for(var i = 0; i < my_values.length; i++) {
      probs[my_values[i]] = my_probs[i];
    }
    
    // loop over each value

    var next_bnm:IBNM[] = [];
    node.getValues().forEach( (value) => 
     {
      scope[node.getName()] = value; 
      
      next_bnm.push(
          { column: node.getName()
          , value: value
          , prob: probs[value]
          , children: this.build_bnm(rem_nodes, rem_cpts, scope) 
          }
      );

      return true;
    });

    // delete the node from scope, just to be safe
    delete scope[node.getName()];

    return next_bnm;
  }

  public create_avatars(n: number) {
    var out = [];
    this.bnm.forEach(
        (bnm) => {
          this.create_avatars2(out, {}, n, bnm); 
          return true; 
    });

    return out;
  }

  // move left to right, at the end, push an array of dicts to `out`
  private create_avatars2(out, dict, n:number, bnm: IBNM) {

    n*= bnm.prob;
    dict[bnm.column] = bnm.value;
     
    if (bnm.children === []) {
      for(var i = 0; i < n; i++) { out.push(dict) }
    } else {
      // should we round, ceil, or floor?
      for(var i = 0; i < Math.round(bnm.children.length); i++) {
        this.create_avatars2(out, dict, n, bnm.children[i]);
      }
    }
  }
}
