/// <reference path="app.d.ts" /> 
/// <reference path="graph_node.ts" /> 
/// <reference path="cpt.ts" /> 
define(["require", "exports", './cpt'], function (require, exports, cpt) {
    // eval(require('fs').readFileSync('../aux_scripts/collections.js', 'utf8'));
    var Edge = (function () {
        function Edge(fr, to) {
            if (fr === null || to === null) {
                throw new Error('Can not construct edge to null node');
            }
            if (fr === to) {
                throw new Error('Edge cannot connect a node onto itself');
            }
            this._to = to;
            this._fr = fr;
        }
        Edge.prototype.fr = function () {
            return this._fr;
        };
        Edge.prototype.to = function () {
            return this._to;
        };
        Edge.prototype.toString = function () {
            return this._fr.getName() + '->' + this._to.getName();
        };
        Edge.prototype.isEqual = function (a) {
            return a.fr() === this._fr && a.to() === this._to;
        };
        Edge.prototype.isParentOf = function (child) {
            return child === this._to;
        };
        Edge.prototype.isChildOf = function (parent) {
            return parent === this._fr;
        };
        return Edge;
    })();
    exports.Edge = Edge;
    var Graph = (function () {
        function Graph(name, nodes) {
            var _this = this;
            if (nodes === void 0) { nodes = []; }
            this.name = name;
            this.edges = new collections.Set();
            this.nodes = new collections.Set(function (gn) { return gn.getName(); });
            nodes.forEach(function (n) { _this.addNode(n); });
        }
        // create a shallow copy of a graph for topsort
        Graph.prototype.clone = function () {
            var g = new Graph(this.name);
            this.nodes.forEach(function (n) { g.addNode(n); return true; });
            this.edges.forEach(function (e) {
                g.addEdge(e.fr(), e.to());
                return true;
            });
            return g;
        };
        Graph.prototype.getName = function () {
            return this.name;
        };
        Graph.prototype.setName = function (name) {
            this.name = name;
        };
        Graph.prototype.addNode = function (node) {
            if (!this.nodes.add(node)) {
                throw new Error('Node Already Exists in Graph');
            }
        };
        Graph.prototype.hasNode = function (node) {
            return this.nodes.contains(node);
        };
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
        Graph.prototype.makeEdge = function (fr, to) {
            if (this.nodes.contains(fr) && this.nodes.contains(to)) {
                return new Edge(fr, to);
            }
            else {
                throw new Error('Edge can not connect to node not in graph');
            }
        };
        Graph.prototype.getNodes = function () {
            return this.nodes.toArray();
        };
        Graph.prototype.deleteNode = function (node) {
            var _this = this;
            if (this.nodes.remove(node)) {
                this.edges.forEach(function (edge) {
                    if (edge.to() === node || edge.fr() === node) {
                        _this.edges.remove(edge);
                    }
                    return true;
                });
            }
        };
        Graph.prototype.addEdge = function (fr, to) {
            this.edges.add(this.makeEdge(fr, to));
        };
        // returns edges as 2d array of node/column names
        Graph.prototype.getEdges = function () {
            return this.edges.toArray();
        };
        Graph.prototype.hasEdge = function (fr, to) {
            return this.edges.contains(this.makeEdge(fr, to));
        };
        Graph.prototype.calculateCpt = function (node) {
            return new cpt.CPT(node, this.getParents(node));
        };
        Graph.prototype.getParents = function (n) {
            var out = [];
            this.edges.forEach(function (edge) {
                if (edge.isParentOf(n)) {
                    out.push(edge.to());
                }
                return true;
            });
            return out;
        };
        Graph.prototype.getChildren = function (n) {
            var out = [];
            this.edges.forEach(function (edge) {
                if (edge.isChildOf(n)) {
                    out.push(edge.to());
                }
                return true;
            });
            return out;
        };
        // topological sort 
        Graph.prototype.topSort = function () {
            var sorted = [];
            var g = this.clone();
            // the set of all nodes containing no children
            var s = new collections.Set(function (n) { return n.getName(); });
            g.getNodes().forEach(function (n) {
                if (g.getParents(n).length === 0) {
                    s.add(n);
                }
            });
            while (s.size() > 0) {
                var n = s.toArray()[0];
                s.remove(n);
                sorted.push(n);
                g.getChildren(n).forEach(function (child) {
                    g.deleteEdge(n, child);
                    if (g.getParents(child).length === 0) {
                        s.add(child);
                    }
                });
            }
            if (g.getEdges().length !== 0) {
                throw new Error('Can Not TopSort, Graph in Cyclic');
            }
            return sorted;
        };
        Graph.prototype.deleteEdge = function (fr, to) {
            this.edges.remove(this.makeEdge(fr, to));
        };
        return Graph;
    })();
    exports.Graph = Graph;
});

//# sourceMappingURL=graph.js.map