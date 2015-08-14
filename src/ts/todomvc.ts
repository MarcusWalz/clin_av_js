/// <reference path="../../typings/angularjs/angular.d.ts" />

import ng = require('angular');

interface ITodoItem {
  text: string;
  done: boolean;
}

interface ITodoScope extends ng.IScope {
  todos : ITodoItem[];
  newTodo : string;
  remainingCount: number;
  vm : TodoCtrl;
}

export class TodoCtrl {
  private todos: ITodoItem[];

  public static $inject = [ '$scope' ];
  constructor( 
        private $scope : ITodoScope ) {

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
  .controller('todoCtrl', TodoCtrl);
