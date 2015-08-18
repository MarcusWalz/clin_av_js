/// <reference path="app.d.ts" />
/// <reference path="graph_node" />
/// <reference path="graph" />

// TODO: Eventually make this the graph modue


import ng = require('angular');
import gn = require('graph_node');
import d3 = require('d3');
import table_reader = require('table_reader');
import graph = require('graph');

interface IGraphScope extends ng.IScope {
  graph: graph.Graph;
  selectedNode: gn.GraphNode;
  vm : TodoCtrl;
}

export class TodoCtrl {
  private force;
  private graph : graph.Graph;
  private _mouseDown : gn.GraphNode;

  public width:number = 1000;
  public height:number = 600;
  public radius:number = 60;

  public static $inject = [ '$scope', 'tableReaderService' ];
  constructor( 
        private $scope : IGraphScope,
        private table_reader : table_reader.TableReaderService ) {


    $scope.vm = this;

    table_reader.get('sample.tab')
      .then( 
        (table) => {
            var nodes = table;

            var g = this.graph 
                  = this.$scope.graph
                  = new graph.Graph("hello", table);

            g.addEdge(nodes[0], nodes[1]);
            g.addEdge(nodes[1], nodes[2]);
            g.addEdge(nodes[2], nodes[3]);
            g.addEdge(nodes[3], nodes[4]);
            g.addEdge(nodes[4], nodes[5]);
            g.addEdge(nodes[5], nodes[6]);
            g.addEdge(nodes[6], nodes[0]);

            this.resetLayout();

            console.log(g.getEdges());
        } , 
        (err) => { 
          alert(err);
        }
      );
  }

  // resets the layout when something has chaged
  private resetLayout() {
    this.force = d3.layout.force()
      .nodes(this.graph.getNodes())
      .links(this.graph.getEdges())
      .size([this.width,this.height])
      .charge(-3000)
      .linkDistance(this.radius * 2)
      .on('tick', () => this.$scope.$apply())
      .start();

  }

  selectNode(node : gn.GraphNode) {
    if (this.$scope.selectedNode === node) {
      this.$scope.selectedNode = null;
    } else if (this.$scope.selectedNode) {
      this.graph.addEdge(this.$scope.selectedNode, node);
      this.resetLayout();
      this.$scope.selectedNode = null;
    } else {
      this.$scope.selectedNode = node;
    }
  }

  mouseDown(node : gn.GraphNode) {
    this._mouseDown = node;
    console.log("mousedown");
  }

  mouseUp(node : gn.GraphNode) {
    console.log("mouseup");
    if (this._mouseDown && this._mouseDown !== node) {
      this.graph.addEdge(this._mouseDown, node);
      this.resetLayout();
    }

    this._mouseDown = null;
  }


  rmNode(node : gn.GraphNode) {
    this.graph.deleteNode(node);
    this.$scope.selectedNode = null;
    this.resetLayout();
  }
  d1(e) {
    var dx = e.target.x - e.source.x;
    var dy = e.target.y - e.source.y;
    var dr = Math.sqrt(dx * dx + dy * dy);
    return 'M' + e.source.x + ',' + e.source.y + 'A' +
      dr + ',' + dr + ' 0, 0,1 ' + e.target.x + ',' +
      e.target.y;
  }
  d(e) {
    var dx = (e.target.x - e.source.x);
    var dy = (e.target.y - e.source.y);
    var dr = Math.sqrt(dx * dx + dy * dy);

    

    var theta = Math.atan2(dy,dx);


    var x1 = Math.cos(theta + Math.PI / 8) * this.radius + e.source.x;
    var y1 = Math.sin(theta + Math.PI / 8) * this.radius + e.source.y;
      
    var x2 = Math.cos(theta) * (dr-this.radius-3) + e.source.x;
    var y2 = Math.sin(theta) * (dr-this.radius-3) + e.source.y;

    var dr2 = Math.sqrt((x1-x2) * (x1-x2) + (y1-y2) * (y1-y2));


    
    return 'M' + x1 + ',' + y1 + 'A' +
      dr + ',' + dr + ' 0, 0,1 ' + x2 + ',' +
      y2;

   // return 'M' + e.target.x + ',' + e.target.y + 'A' + e.source.x + ',' + e.source.y;
    
   // return 'M' + 0 + ',' + 0 + 'A' + x2 + ',' + y2;
  }
}

var todomvc = ng.module('todomvc', [])
  .controller('todoCtrl', TodoCtrl)
  .service('tableReaderService', table_reader.TableReaderService); 
