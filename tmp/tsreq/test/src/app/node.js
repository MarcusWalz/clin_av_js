var Graph;
(function (Graph) {
    var GraphNode = (function () {
        function GraphNode() {
            // the ordered data 
            // which value is missing in values array is missing
            this.missingVal = null;
        }
        GraphNode.prototype.consturct = function (name, column) {
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
        };
        // returns a list of values with missing first
        GraphNode.prototype.getValues = function () {
            var vals = [];
            if (this.missingVal) {
                vals.push(this.missingVal);
            }
            for (var i = 0; i < this.values.length; i++) {
                if (!(this.missingVal === i)) {
                    vals.push(this.values[i]);
                }
            }
            return vals;
        };
        // returns the nth row
        GraphNode.prototype.getData = function (n) {
            // TODO check to make sure everything is in range
            return this.values[this.ndata[n]];
        };
        // returns number of data points
        GraphNode.prototype.length = function () {
            return this.ndata.length;
        };
        GraphNode.prototype.setMissingVal = function (missing) {
            // TODO fail if field doesn't exist
            this.missingVal = this.values.indexOf(missing);
        };
        // returns missing value if it exists, null if it doesn't
        GraphNode.prototype.getMissingVal = function () {
            if (this.missingVal) {
                return this.values[this.missingVal];
            }
            return null;
        };
        GraphNode.prototype.data = function () {
            return this.ndata.map(function (index) { return this.values[index]; });
        };
        return GraphNode;
    })();
    Graph.GraphNode = GraphNode;
})(Graph || (Graph = {}));
