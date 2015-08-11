/// <reference path="app.d.ts" /> 
/// <reference path="graph_node.ts" /> 
/// <reference path="cpt.ts" /> 

import graph_node = require('graph_node');
import cpt        = require('./cpt');

eval(require('fs').readFileSync('../aux_scripts/collections.js', 'utf8'));


export class Edge {
  private _fr:graph_node.GraphNode;
  private _to:graph_node.GraphNode;

  constructor(fr:graph_node.GraphNode, to:graph_node.GraphNode) {
    if(fr === null || to === null) {
      throw new Error("Can not construct edge to null node");
    }
    if(fr === to) {
      throw new Error("Edge cannot connect a node to itself");
    }

    this._to = to;
    this._fr = fr;
  }

  fr(): graph_node.GraphNode {
    return this._fr;
  }

  to() : graph_node.GraphNode {
    return this._to;
  }

  toString() : string {
    return this._fr.getName() + '->' + this._to.getName();
  }

  isEqual(a:Edge):boolean {
    return a.fr() === this._fr && a.to() === this._to;
  }

  isParentOf(child:graph_node.GraphNode) : boolean {
    return child === this._to;
  }

  isChildOf(parent:graph_node.GraphNode) : boolean {
    return parent === this._fr;
  }

}

export class Graph {
  private name:string;
  private nodes:collections.Set<graph_node.GraphNode>;
  private edges:collections.Set<Edge>;

  constructor(name: string, nodes:graph_node.GraphNode[] = []) {
    this.name  = name;
    this.edges = new collections.Set<Edge>();
    this.nodes = new collections.Set<graph_node.GraphNode>(
        (gn) => { return gn.getName(); } );

    nodes.forEach((n) => { this.addNode(n); });
  }

  // create a shallow copy of a graph for topsort
  private clone() : Graph {
    var g:Graph = new Graph(this.name);

    this.nodes.forEach((n) => { g.addNode(n); return true; });
    this.edges.forEach((e) => 
        { g.addEdge(e.fr(), e.to()); return true; });

    return g;
  }

  getName() : string {
    return this.name;
  }

  setName(name: string) {

    this.name = name;

  }

  addNode(node : graph_node.GraphNode) {
    if (!this.nodes.add(node)) {
      throw new Error("Node Already Exists in Graph");
    }
  }

  hasNode(node : graph_node.GraphNode) {
    return this.nodes.contains(node);
  }
/*
  getNode(node_name : string) : graph_node.GraphNode {
    var nodes = this.nodes.toArray();

    for (var i:number = 0; i < nodes.length; i++) {
      if (nodes[i].getName() === node_name) {
        return nodes[i];
      }
    }
    return null;
  }
*/

  // fails if a node d.n.e in graph
  private makeEdge(fr: graph_node.GraphNode, to:graph_node.GraphNode) : Edge {
    if(this.nodes.contains(fr) && this.nodes.contains(to)) {
      return new Edge(fr, to);
    } else {
      throw new Error('Edge can not connect to node not in graph');
    }

  }

  getNodes() : graph_node.GraphNode[] {
    return this.nodes.toArray();
  }

  deleteNode(node: graph_node.GraphNode) { 
    if( this.nodes.remove(node)) {
      this.edges.forEach( (edge:Edge) => {
        if(edge.to() === node || edge.fr() === node) {
          this.edges.remove(edge);
        }
        return true;
      });
    }
  }

  addEdge(fr: graph_node.GraphNode, to: graph_node.GraphNode) {
    this.edges.add(this.makeEdge(fr, to));
  }

  // returns edges as 2d array of node/column names
  getEdges() : Edge[] {
    return this.edges.toArray();
  }

  hasEdge(fr: graph_node.GraphNode, to: graph_node.GraphNode) : boolean {
    return this.edges.contains(this.makeEdge(fr,to));
  }

  calculateCpt(node: graph_node.GraphNode) : cpt.CPT {
    return new cpt.CPT(node, this.getParents(node));
  }


  getParents(n : graph_node.GraphNode) : graph_node.GraphNode[] {
    var out = [];
    this.edges.forEach((edge) => {
      if(edge.isParentOf(n)) { out.push(edge.to()); }
      return true;
    });
    return out;
  }

  getChildren(n : graph_node.GraphNode) : graph_node.GraphNode[] {
    var out = [];
    this.edges.forEach((edge) => {
      if(edge.isChildOf(n)) { out.push(edge.to()); }
      return true;
    });
    return out;
  }

  // topological sort 
  topSort() : graph_node.GraphNode[] {
    var sorted = [];
    var g:Graph = this.clone();

    // the set of all nodes containing no children
    var s:collections.Set<graph_node.GraphNode> 
      = new collections.Set<graph_node.GraphNode>(
        (n) => { return n.getName(); }
    ); 

    g.getNodes().forEach( (n) =>
        { if (g.getParents(n).length === 0) {
            s.add(n); 
          }
        });


    while(s.size() > 0) {
      var n = s.toArray()[0];
      s.remove(n);
      sorted.push(n);
      
      g.getChildren(n).forEach((child) => {
        g.deleteEdge(n, child);
        if(g.getParents(child).length === 0) {
          s.add(child);
        }
      });
    }

    if(g.getEdges().length !== 0) {
        throw new Error("Can Not TopSort, Graph in Cyclic");
    }
    return sorted;
  }

  deleteEdge(fr: graph_node.GraphNode, to: graph_node.GraphNode) {
    this.edges.remove(this.makeEdge(fr, to));
  }
}
