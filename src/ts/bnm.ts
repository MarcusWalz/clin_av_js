/// <references path="./graph_node.ts" />
/// <references path="./cpt.ts" />
/// <references path="./graph.ts" />

import d3 = require('d3');
import graph_node = require('./graph_node');
import cpt   = require('./cpt');
import graph = require('./graph');


// Tree struct for BNM
export interface IBNM {
  column: string; // name of node
  val: string;  // value
  prob:  number;  // p(value)
  children: IBNM[]; 
}


// sample dictionary
export interface IRecord {
  [column: string] : string;
}

export class BNM {
  public bnm:IBNM[];

  constructor(private g : graph.Graph) {
    // TODO Catch and report error if graph is not acylclic
    var nodes = g.topSort();
    var prob_tables = nodes.map( (n) => new cpt.CPT(n, g.getParents(n)) );
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
    if(cpt.header.conditions.length == 0) {
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
      
      var index:number = -1;

      for(var i = 0; i < cpt.rows.length; i++) {
        var found: boolean = false; 
        for(var j = 0; j < cpt.header.conditions.length; j++) {
          if (cpt.rows[i].conditions[j] != my_row[j]) { 
            found = false;
            break;
          } else {
            found = true;
          }
        }
        if(found) {
          index = i;
          break;
        }
      }
      if(index != -1) {
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
          , val: value
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


  // When Stochastic = true, avatars are constructed through the dice-roll
  // method. 
  //
  // Complexity is O(n * m) where n is the number of avatars and n is the
  // number of columns.
  //
  // When Stochastic = false, avatars are constructed through scalar-like
  // multiplication.
  // 
  // Here Complexity and memory usage is O( e ), where e is the product of
  // the length of each lookup table in the bnm. This method is fast, but
  // due to rounding errors, it returns only an aproximate number of avatars.

  public create_avatars(n: number, stochastic:boolean = false) {
    console.log(this.bnm);
    var out = [];

    if (stochastic) {
      for(var i = 0; i < n; i++) {
        this.create_avatars_stochastic(out, {}, this.bnm);
      }
    } else {
      this.bnm.forEach(
          (bnm) => {
            this.create_avatars2(out, {}, n, bnm); 
            return true; 
      });
    }

    return out;
  }

  private create_avatars_stochastic(out:IRecord[], scope:IRecord, bnm:IBNM[] )  {

    if (bnm.length == 0) {
      out.push(scope);
      return;
    }

    var num = Math.random();
    var pos = 0;

    // in case of rounding error, let's preset this to the last
    var target = bnm[bnm.length - 1];

    for(var i = 0; i < bnm.length; i++) {
      if(pos <= num && num < pos + bnm[i].prob) {;
        target = bnm[i];
        break;
      } else {
        pos += bnm[i].prob;
      }
    }

    scope[target.column] = target.val;
    this.create_avatars_stochastic(out, scope, target.children); 

  }

  // move left to right, at the end, push an array of dicts to `out`
  private create_avatars2(out:IRecord[], dict:IRecord, n:number, bnm: IBNM) {

    n*= bnm.prob;
    dict[bnm.column] = bnm.val;
     
    if (bnm.children.length == 0) {
      for(var i = 0; i < n; i++) { out.push(JSON.parse(JSON.stringify(dict))) }
    } else {
      // should we round, ceil, or floor?
      for(var i = 0; i < Math.round(bnm.children.length); i++) {
        this.create_avatars2(out, dict, n, bnm.children[i]);
      }
    }
  }

  public visual() {

  var width = 960,
      height = 700,
      radius = Math.min(width, height) / 2,
      color = d3.scale.category20c();

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

  var partition = d3.layout.partition()
      .sort(null)
      .size([2 * Math.PI, radius * radius])
      .value(function(d) { return d.prob * 100; });

  var arc = d3.svg.arc()
      .startAngle(function(d) { return d.x; })
      .endAngle(function(d) { return d.x + d.dx; })
      .innerRadius(function(d) { return Math.sqrt(d.y); })
      .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

    var root = { val: "test", children: this.bnm } 

    var path = svg.datum(root).selectAll("path")
        .data(partition.nodes)
      .enter().append("path")
        .attr("display", function(d) { return d.depth == null : "none"; }) // hide inner ring
        .attr("d", arc)
        .style("stroke", "#fff")
        .style("fill", function(d) { return color((d.children ? d : d.parent).val); })
        .style("fill-rule", "evenodd")


d3.select(self.frameElement).style("height", height + "px");


  }
}
