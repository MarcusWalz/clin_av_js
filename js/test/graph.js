/// <reference path="test.d.ts" />
/// <reference path="../graph_node.ts" />
/// <reference path="../graph.ts" />
define(["require", "exports", 'chai', '../graph_node', '../graph'], function (require, exports, chai, graph_node, graph) {
    // fuck node
    // eval(require('fs').readFileSync('../aux_scripts/all.js', 'utf8'));
    //console.log(collections);
    var expect = chai.expect;
    describe('Graph', function () {
        var in_column = ['1', '2', '3', '*', '3'];
        var gn1 = new graph_node.GraphNode('N1', in_column);
        var gn2 = new graph_node.GraphNode('N2', in_column);
        var gn3 = new graph_node.GraphNode('N3', in_column);
        var gn4 = new graph_node.GraphNode('N4', in_column);
        var gn5 = new graph_node.GraphNode('N5', in_column);
        var all_gn = [gn1, gn2, gn3, gn4];
        var g = new graph.Graph('test.txt', [gn1, gn2]);
        it('should have name', function (done) {
            expect(g.getName()).to.equals('test.txt');
            done();
        });
        it('.setName should change it', function (done) {
            g.setName('penis');
            expect(g.getName()).to.equals('penis');
            done();
        });
        /*
        it('.getNode should lookup node', (done) => {
          expect(g.getNode(gn1.getName())).to.equal(gn1);
          done();
        });
        */
        it('.hasNode should return false, if node dne', function (done) {
            expect(g.hasNode(gn3)).to.be.false;
            done();
        });
        it('.addNode should be able to add unique node', function (done) {
            g.addNode(gn3);
            expect(g.hasNode(gn3)).to.be.true;
            done();
        });
        it('.addNode should require that new node is of equal length');
        it('.addNode should throw error when adding duplicate node', function (done) {
            expect(function () { g.addNode(gn3); }).to.throw(Error);
            done();
        });
        it('.deleteNode should delete the correct node', function (done) {
            g.deleteNode(gn3);
            expect(g.hasNode(gn3)).to.be.false;
            expect(g.hasNode(gn1)).to.be.true;
            expect(g.hasNode(gn2)).to.be.true;
            done();
        });
        it('.deleteNode should delete edges to/from the node', function (done) {
            g.addNode(gn3);
            g.addEdge(gn1, gn3);
            g.addEdge(gn3, gn2);
            g.deleteNode(gn3);
            expect(g.getEdges()).to.be.eql([]);
            done();
        });
        it('.hasEdge should return false if edge dne', function (done) {
            expect(g.hasEdge(gn1, gn2)).to.be.false;
            done();
        });
        it('.addEdge should create a new edge', function (done) {
            g.addEdge(gn1, gn2);
            expect(g.getEdges()).to.be.eql([new graph.Edge(gn1, gn2)]);
            expect(g.hasEdge(gn1, gn2)).to.be.true;
            done();
        });
        it('.deleteEdge should delete an edge', function (done) {
            g.deleteEdge(gn1, gn2);
            expect(g.hasEdge(gn1, gn2)).to.be.false;
            done();
        });
        var g2 = new graph.Graph('empty');
        it('.topSort should produce empty list on empty graph', function (done) {
            expect(g2.topSort()).to.be.eql([]);
            done();
        });
        it('.topSort should work on a singleton graph', function (done) {
            g2.addNode(gn1);
            expect(g2.topSort()).to.be.eql([gn1]);
            done();
        });
        it('.topSort should work on a two and three element chain', function (done) {
            g2.addNode(gn2);
            g2.addEdge(gn1, gn2);
            expect(g2.topSort()).to.be.eql([gn1, gn2]);
            g2.addNode(gn3);
            g2.addEdge(gn2, gn3);
            expect(g2.topSort()).to.be.eql([gn1, gn2, gn3]);
            done();
        });
        it('.topSort should fail on a cycle', function (done) {
            g2.addEdge(gn3, gn1);
            expect(function () { g2.topSort(); }).to.throw(Error);
            done();
        });
        it('.topSort should work in a complicated graph', function (done) {
            var g = new graph.Graph('complicated', [gn1, gn2, gn3, gn4, gn5]);
            g.addEdge(gn1, gn2);
            g.addEdge(gn1, gn3);
            g.addEdge(gn2, gn4);
            g.addEdge(gn3, gn4);
            g.addEdge(gn4, gn5);
            var sort = g.topSort();
            expect(sort.length).to.equal(5);
            expect(sort[0]).to.equal(gn1);
            expect(sort[1] === gn2 || sort[1] === gn3).to.be.true;
            expect(sort[2] === gn2 || sort[2] === gn3).to.be.true;
            expect(sort[3]).to.equal(gn4);
            expect(sort[4]).to.equal(gn5);
            done();
        });
    });
});

//# sourceMappingURL=../test/graph.js.map