/// <reference path="graph_node.ts" /> 
/// <reference path="graph.ts" /> 
define(["require", "exports", 'babyparse', 'fs', './graph_node', './graph'], function (require, exports, Baby, fs, graph_node, graph) {
    fs.readFile('/home/mewalz/sample.tab', 'utf8', function (err, dat) {
        if (err) {
            throw err;
        }
        ;
        var p = Baby.parse(dat, { header: true, delimiter: ' ' });
        var hash = {};
        p.meta.fields.forEach(function (f) { hash[f] = []; });
        p.data.forEach(function (row) {
            for (var field in row) {
                hash[field].push(row[field]);
            }
        });
        console.log(hash);
        var g = new graph.Graph('hello world');
        for (var field in hash) {
            g.addNode(new graph_node.GraphNode(field, hash[field]));
        }
        var nodes = g.getNodes();
        g.addEdge(nodes[0], nodes[3]);
        g.addEdge(nodes[1], nodes[3]);
        g.addEdge(nodes[2], nodes[3]);
        console.log(g);
        console.log(g.calculateCpt(nodes[3]));
    });
});

//# sourceMappingURL=input.js.map