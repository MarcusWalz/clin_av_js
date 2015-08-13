/// <reference path="graph_node.ts" /> 
define(["require", "exports"], function (require, exports) {
    var CPT = (function () {
        // build a conditional prob table
        function CPT(node, parents) {
            this.node = node;
            this.parents = parents;
            this.offsets = this.calc_offsets();
            // number of conditions = product of value lengths
            this.conditions = parents.map(function (p) {
                return p.getValues().length;
            }).reduce(function (a, b) {
                return a * b;
            }, 1);
            this.counts = new Array(this.conditions);
            var base_arr = new Array(node.getValues().length);
            for (var i = 0; i < base_arr.length; i++) {
                base_arr[i] = 0;
            }
            for (var i = 0; i < this.counts.length; i++) {
                this.counts[i] = base_arr.slice(); // copy
            }
            for (var i = 0; i < this.node.ndata.length; i++) {
                var index = this.index(this.parents.map(function (p) { return p.ndata[i]; }));
                this.counts[index][node.ndata[i]]++;
            }
        }
        // contstruct array for lookup function
        CPT.prototype.calc_offsets = function () {
            var t;
            var offset = new Array(this.parents.length);
            for (var i = 0; i < this.parents.length; i++) {
                offset[i] = 1;
                for (var j = i + 1; j < this.parents.length; j++) {
                    offset[i] *= this.parents[j].getValues().length;
                }
            }
            return offset;
        };
        // find the index by taking cross-product of valuess and offset arrays
        CPT.prototype.index = function (values) {
            var num = 0;
            for (var i = 0; i < this.parents.length; i++) {
                num += this.offsets[i] * values[i];
            }
            return num;
        };
        // inverse of index
        CPT.prototype.unindex = function (id) {
            var values = [];
            for (var i = 0; i < this.parents.length; i++) {
                var current_val = Math.floor(id / this.offsets[i]);
                values.push(current_val);
                id -= current_val * this.offsets[i];
            }
            return values;
        };
        CPT.prototype.conditionTable = function () {
            var table = [];
            for (var i = 0; i < this.conditions; i++) {
                var indexes = this.unindex(i);
                var row = [];
                for (var j = 0; j < indexes.length; j++) {
                    row.push(this.parents[j].getValues()[indexes[j]]);
                }
                table.push(row);
            }
            return table;
        };
        return CPT;
    })();
    exports.CPT = CPT;
});

//# sourceMappingURL=cpt.js.map