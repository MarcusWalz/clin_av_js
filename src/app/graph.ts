/// <reference path="app.d.ts" /> 
/// <reference path="graph_node.ts" /> 

// TODO Edge data struct

import graph_node  = require('graph_node');

class Edge {
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
  private nodes:graph_node.GraphNode[] = [];
  private edges:collections.Set<Edge>;

  constructor(name: string, nodes:graph_node.GraphNode[] = []) {
    this.name = name;
    this.edges = new collections.Set<Edge>();

    nodes.forEach((n) => { this.addNode(n); });
  }


  getName() : string {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  addNode(node : graph_node.GraphNode) {

    for (var i:number = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].getName() === node.getName()) {
        throw Error('Node name must be unique');
      }
    }
    this.nodes.push(node);
  }

  getNode(node_name : string) : graph_node.GraphNode {
    for (var i:number = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].getName() === node_name) {
        return this.nodes[i];
      }
    }
    return null;
  }

  // fails like we want
  private makeEdge(fr:string, to:string) : Edge {
    return new Edge(this.getNode(fr), this.getNode(to)) ;
  }

  getNodes() : graph_node.GraphNode[] {
    return this.nodes;
  }

  deleteNode(node_name: string) { 
    var node = this.getNode(node_name);
    if (node === null) {
      throw new Error('Can\'t delete. Node not member of graph');
    } else { this.nodes.splice(this.nodes.indexOf(node), 1); }
  }

  addEdge(fr:string, to:string) {
    this.edges.add(this.makeEdge(fr, to));
  }

  // returns edges as 2d array of node/column names
  getEdges() : Edge[] {
    return this.edges.toArray();
  }

  hasEdge(fr: string, to: string) : boolean {
    return this.edges.contains(this.makeEdge(fr,to));
  }

  deleteEdge(fr: string, to: string) {
    this.edges.remove(this.makeEdge(fr, to));
  }
}
