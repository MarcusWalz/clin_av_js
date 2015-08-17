/// <reference path="app.d.ts" />
/// <reference path="graph_node" />
/// <reference path="graph" />


import ng = require('angular');
import gn = require('graph_node');
import d3 = require('d3');
import table_reader = require('table_reader');
import graph = require('graph');

interface ITodoItem {
  text: string;
  done: boolean;
}

interface ITodoScope extends ng.IScope {
  todos : ITodoItem[];
  graph: graph.Graph;
  newTodo : string;
  remainingCount: number;
  vm : TodoCtrl;
}

export class TodoCtrl {
  private todos: ITodoItem[];

  public static $inject = [ '$scope', 'tableReaderService' ];
  constructor( 
        private $scope : ITodoScope,
        private table_reader : table_reader.TableReaderService ) {

    table_reader.get('/sample.tab')
      .then( 
        (table) => {
            var nodes = table;
            var g = this.$scope.graph = new graph.Graph("hello", table)
            g.addEdge(nodes[0], nodes[3]);
            g.addEdge(nodes[1], nodes[3]);
            g.addEdge(nodes[2], nodes[3]);
            g.addEdge(nodes[1], nodes[4]);
            g.addEdge(nodes[3], nodes[2]);


            d3.layout.force()
              .nodes(g.getNodes())
              .links(g.getEdges())
              .size([1000,1000])
              .charge(-3000)
              .linkDistance(400)
              .on('tick', () => $scope.$apply())
              .start();

            console.log(g.getEdges());
        } , 
        (err) => { 
          alert(err);
        }
      );

    this.todos = $scope.todos = [
      {text: 'learn angular', done: true }, 
      {text: 'build an angular app', done: false }
    ];

    $scope.newTodo = '';
    $scope.vm = this;

    $scope.$watch('todos', () => this.onTodos(), true)
  }

  onTodos() {
    this.$scope.remainingCount =
      this.todos.filter((todo) => !todo.done).length;
  }

  addTodo() {
    var newTodo : string = this.$scope.newTodo.trim();
    if (!newTodo.length) {
      return;
    }

    this.todos.push({text: newTodo, done: false });
  } 

  removeTodo(todoItem: ITodoItem) {
    this.todos.splice(this.todos.indexOf(todoItem), 1);
  }
}

var todomvc = ng.module('todomvc', [])
  .controller('todoCtrl', TodoCtrl)
  .service('tableReaderService', table_reader.TableReaderService); 
