/// <reference path="../../typings/papaparse/papaparse.d.ts" />
/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="graph_node.ts" /> 
/// <reference path="graph.ts" /> 
define(["require", "exports", 'papaparse', 'd3', './graph_node', './graph'], function (require, exports, papaparse, d3, graph_node, graph) {
    function showGraph(g) {
        var width = 960, height = 700;
        color = d3.scale.category20();
        var links = g.getEdges().map(function (edge) {
            return { source: edge.fr(),
                target: edge.to()
            };
        });
        var force = d3.layout.force()
            .nodes(g.getNodes())
            .links(links)
            .charge(-3000)
            .linkDistance(200)
            .on('tick', tick)
            .size([width, height])
            .start();
        var svg = d3.select('body').append('svg')
            .attr('width', width)
            .attr('height', height);
        // build the arrow.
        svg.append("svg:defs").selectAll("marker")
            .data(["end"]) // Different link/path types can be defined here
            .enter().append("svg:marker") // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");
        var path = svg.append('svg:g').selectAll("path")
            .data(force.links())
            .enter().append('svg:path')
            .attr('class', 'link');
        var node = svg.selectAll('.node')
            .data(force.nodes())
            .enter().append('g')
            .attr('class', 'node')
            .call(force.drag);
        var pie = d3.layout.pie()
            .sort(null);
        var color = d3.scale.category20();
        var arc = d3.svg.arc()
            .innerRadius(50)
            .outerRadius(60);
        node.selectAll("path")
            .data(function (d, i) { return pie(d.histogram()); })
            .enter()
            .append('svg:path')
            .attr('d', arc)
            .attr('fill', function (d, i) { return color(i); });
        node.append('circle')
            .attr('r', 50);
        console.log(node);
        node.append('text')
            .attr('text-anchor', 'middle')
            .text(function (n) { return n.getName(); });
        // add the curvy lines
        function tick() {
            path.attr("d", function (d) {
                var dx = d.target.x - d.source.x, dy = d.target.y - d.source.y, dr = Math.sqrt(dx * dx + dy * dy);
                return "M" +
                    d.source.x + "," +
                    d.source.y + "A" +
                    dr + "," + dr + " 0 0,1 " +
                    d.target.x + "," +
                    d.target.y;
            });
            node
                .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        }
    }
    function genGraph(p) {
        var hash = {};
        p.meta.fields.forEach(function (f) { hash[f] = []; });
        p.data.forEach(function (row) {
            for (var field in row) {
                hash[field].push(row[field]);
            }
        });
        var g = new graph.Graph('hello world');
        for (var field in hash) {
            g.addNode(new graph_node.GraphNode(field, hash[field]));
        }
        var nodes = g.getNodes();
        g.addEdge(nodes[0], nodes[3]);
        g.addEdge(nodes[1], nodes[3]);
        g.addEdge(nodes[2], nodes[3]);
        g.addEdge(nodes[1], nodes[4]);
        g.addEdge(nodes[3], nodes[2]);
        nodes.forEach(function (n) { console.log(n.histogram()); return true; });
        console.log(g);
        console.log(g.calculateCpt(nodes[3]));
        showGraph(g);
    }
    papaparse.parse('./sample.tab', {
        header: true,
        download: true,
        worker: false,
        complete: function (p, err) {
            if (err) {
                alert(err);
            }
            else {
                genGraph(p);
            }
        },
        delimiter: ' ' });
});

//# sourceMappingURL=entry.js.map
