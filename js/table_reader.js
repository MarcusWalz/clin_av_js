/// <references "app.d.ts" />
/// <references "graph_node.ts" />
define(["require", "exports", 'papaparse', 'graph_node'], function (require, exports, papa, graph_node) {
    // papa parsed object not in def file
    function constructTable(table) {
        var hash = {};
        table.meta.fields.forEach(function (f) { hash[f] = []; });
        table.data.forEach(function (row) {
            for (var field in row) {
                hash[field].push(row[field]);
            }
        });
        var nodes = [];
        for (var field in hash) {
            nodes.push(new graph_node.GraphNode(field, hash[field]));
        }
        return nodes;
    }
    var TableReaderService = (function () {
        function TableReaderService($q) {
            this.$q = $q;
        }
        TableReaderService.prototype.get = function (url) {
            var deferred = this.$q.defer();
            deferred.notify("About to read table");
            papa.parse(url, {
                download: true,
                delimiter: ' ',
                header: true,
                error: function (err) { return deferred.reject(err); },
                complete: function (out, err) {
                    return err ? deferred.reject(err) : deferred.resolve(constructTable(out));
                }
            });
            return deferred.promise;
        };
        TableReaderService.inject = ['$q'];
        return TableReaderService;
    })();
    exports.TableReaderService = TableReaderService;
});

//# sourceMappingURL=table_reader.js.map