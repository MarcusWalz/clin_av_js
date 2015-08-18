/// <reference path="../../typings/angularjs/angular.d.ts" />
define(["require", "exports"], function (require, exports) {
    var TodoCtrl = (function () {
        function TodoCtrl($location, $scope) {
            var _this = this;
            this.$location = $location;
            this.$scope = $scope;
            this.todos = $scope.todos = [
                { text: 'learn angular', done: true },
                { text: 'build an angular app', done: false }
            ];
            $scope.newTodo = '';
            $scope.vm = this;
            $scope.$watch('todos', function () { return _this.onTodos(); }, true);
        }
        TodoCtrl.prototype.onTodos = function () {
            this.$scope.remainingCount =
                this.todos.filter(function (todo) { return !todo.done; }).length;
        };
        TodoCtrl.prototype.addTodo = function () {
            var newTodo = this.$scope.newTodo.trim();
            if (!newTodo.length) {
                return;
            }
            this.todos.push({ text: newTodo, done: false });
        };
        TodoCtrl.prototype.removeTodo = function (todoItem) {
            this.todos.splice(this.todos.indexOf(todoItem), 1);
        };
        TodoCtrl.$inject = ['$scope'];
        return TodoCtrl;
    })();
    exports.TodoCtrl = TodoCtrl;
    var todomvc = angular.module('todomvc', [])
        .controller('todoCtrl', TodoCtrl);
});

//# sourceMappingURL=ng_test.js.map