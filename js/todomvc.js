/// <reference path="app.d.ts" />
/// <reference path="graph_node" />
/// <reference path="graph" />
define(["require", "exports", 'angular', 'd3', 'table_reader', 'graph'], function (require, exports, ng, d3, table_reader, graph) {
    var TodoCtrl = (function () {
        function TodoCtrl($scope, table_reader) {
            var _this = this;
            this.$scope = $scope;
            this.table_reader = table_reader;
            this.width = 1000;
            this.height = 600;
            this.radius = 60;
            $scope.vm = this;
            table_reader.get('sample.tab')
                .then(function (table) {
                var nodes = table;
                var g = _this.graph
                    = _this.$scope.graph
                        = new graph.Graph("hello", table);
                g.addEdge(nodes[0], nodes[1]);
                g.addEdge(nodes[1], nodes[2]);
                g.addEdge(nodes[2], nodes[3]);
                g.addEdge(nodes[3], nodes[4]);
                g.addEdge(nodes[4], nodes[5]);
                g.addEdge(nodes[5], nodes[6]);
                g.addEdge(nodes[6], nodes[0]);
                _this.resetLayout();
                console.log(g.getEdges());
            }, function (err) {
                alert(err);
            });
        }
        // resets the layout when something has chaged
        TodoCtrl.prototype.resetLayout = function () {
            var _this = this;
            this.force = d3.layout.force()
                .nodes(this.graph.getNodes())
                .links(this.graph.getEdges())
                .size([this.width, this.height])
                .charge(-3000)
                .linkDistance(this.radius * 2)
                .on('tick', function () { return _this.$scope.$apply(); })
                .start();
        };
        TodoCtrl.prototype.selectNode = function (node) {
            if (this.$scope.selectedNode === node) {
                this.$scope.selectedNode = null;
            }
            else if (this.$scope.selectedNode) {
                this.graph.addEdge(this.$scope.selectedNode, node);
                this.resetLayout();
                this.$scope.selectedNode = null;
            }
            else {
                this.$scope.selectedNode = node;
            }
        };
        TodoCtrl.prototype.mouseDown = function (node) {
            this._mouseDown = node;
            console.log("mousedown");
        };
        TodoCtrl.prototype.mouseUp = function (node) {
            console.log("mouseup");
            if (this._mouseDown && this._mouseDown !== node) {
                this.graph.addEdge(this._mouseDown, node);
                this.resetLayout();
            }
            this._mouseDown = null;
        };
        TodoCtrl.prototype.rmNode = function (node) {
            this.graph.deleteNode(node);
            this.$scope.selectedNode = null;
            this.resetLayout();
        };
        TodoCtrl.prototype.d1 = function (e) {
            var dx = e.target.x - e.source.x;
            var dy = e.target.y - e.source.y;
            var dr = Math.sqrt(dx * dx + dy * dy);
            return 'M' + e.source.x + ',' + e.source.y + 'A' +
                dr + ',' + dr + ' 0, 0,1 ' + e.target.x + ',' +
                e.target.y;
        };
        TodoCtrl.prototype.d = function (e) {
            var dx = (e.target.x - e.source.x);
            var dy = (e.target.y - e.source.y);
            var dr = Math.sqrt(dx * dx + dy * dy);
            var theta = Math.atan2(dy, dx);
            var x1 = Math.cos(theta + Math.PI / 8) * this.radius + e.source.x;
            var y1 = Math.sin(theta + Math.PI / 8) * this.radius + e.source.y;
            var x2 = Math.cos(theta) * (dr - this.radius - 3) + e.source.x;
            var y2 = Math.sin(theta) * (dr - this.radius - 3) + e.source.y;
            var dr2 = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
            return 'M' + x1 + ',' + y1 + 'A' +
                dr + ',' + dr + ' 0, 0,1 ' + x2 + ',' +
                y2;
            // return 'M' + e.target.x + ',' + e.target.y + 'A' + e.source.x + ',' + e.source.y;
            // return 'M' + 0 + ',' + 0 + 'A' + x2 + ',' + y2;
        };
        TodoCtrl.$inject = ['$scope', 'tableReaderService'];
        return TodoCtrl;
    })();
    exports.TodoCtrl = TodoCtrl;
    var todomvc = ng.module('todomvc', [])
        .controller('todoCtrl', TodoCtrl)
        .service('tableReaderService', table_reader.TableReaderService);
});

//# sourceMappingURL=todomvc.js.map