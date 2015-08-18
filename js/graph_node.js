/// <requires "app.d.ts" />
define(["require", "exports", 'd3'], function (require, exports, d3) {
    var GraphNode = (function () {
        function GraphNode(name, column) {
            // the ordered data 
            // which value is missing in values array is missing
            this.missingVal = null;
            this.name = name;
            this.values = [];
            this.ndata = new Array(column.length);
            for (var i = 0; i < column.length; i++) {
                var valueIdx = this.values.indexOf(column[i]);
                if (valueIdx === -1) {
                    this.values.push(column[i]);
                    valueIdx = this.values.length - 1;
                }
                // store the value
                this.ndata[i] = valueIdx;
            }
            if (this.values.length <= 1) {
                throw new Error('Column ' + name + ' must have at least two differing values');
            }
            var pie = d3.layout.pie()
                .sort(null);
            var color = d3.scale.category20();
            var arc = d3.svg.arc()
                .innerRadius(50)
                .outerRadius(60);
            var arcs = pie(this.histogram()).map(arc);
            this.donut = [];
            for (var i = 0; i < this.values.length; i++) {
                this.donut.push({ name: this.values[i],
                    arc: arcs[i],
                    color: color(i) });
            }
            console.log(this.donut);
        }
        GraphNode.prototype.getName = function () {
            return this.name;
        };
        GraphNode.prototype.setName = function (name) {
            this.name = name;
        };
        // returns a list of values with missing first
        GraphNode.prototype.getValues = function () {
            var vals = [];
            if (this.missingVal) {
                vals.push(this.values[this.missingVal]);
            }
            for (var i = 0; i < this.values.length; i++) {
                if (!(this.missingVal === i)) {
                    vals.push(this.values[i]);
                }
            }
            return vals;
        };
        GraphNode.prototype.getValue = function (i) {
            return this.values[i];
        };
        // returns the value at the nth row
        GraphNode.prototype.getCell = function (row) {
            if (row >= this.length()) {
                throw new RangeError;
            }
            else {
                return this.values[this.ndata[row]];
            }
        };
        // returns number of data points
        GraphNode.prototype.length = function () {
            return this.ndata.length;
        };
        GraphNode.prototype.setMissingVal = function (missing) {
            this.missingVal = this.values.indexOf(missing);
        };
        // returns missing value if it exists, null if it doesn't
        GraphNode.prototype.getMissingVal = function () {
            if (this.missingVal) {
                return this.values[this.missingVal];
            }
            return null;
        };
        GraphNode.prototype.getColumn = function () {
            var _this = this;
            return this.ndata.map(function (index) { return _this.values[index]; });
        };
        // return the node as a histogram
        GraphNode.prototype.histogram = function () {
            var base_hist = this.values.map(function (i) { return 0; });
            this.ndata.forEach(function (i) { base_hist[i]++; return true; });
            return base_hist;
        };
        return GraphNode;
    })();
    exports.GraphNode = GraphNode;
});

//# sourceMappingURL=graph_node.js.map