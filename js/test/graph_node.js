/// <reference path="test.d.ts" />
/// <reference path="../graph_node.ts" />
define(["require", "exports", 'chai', '../graph_node'], function (require, exports, chai, graph_node) {
    var expect = chai.expect;
    describe('Graph Node', function () {
        var in_column = ['1', '2', '3', '*', '3'];
        var g = new graph_node.GraphNode('Hello', in_column);
        it('should have name', function (done) {
            expect(g.getName()).to.equals('Hello');
            done();
        });
        it('name should be changeable', function (done) {
            g.setName('Change');
            expect(g.getName()).to.equals('Change');
            done();
        });
        it('should have length equal to input column', function (done) {
            expect(g.length()).to.equals(in_column.length);
            done();
        });
        it('.getMissingVal() should be null', function (done) {
            expect(g.getMissingVal()).to.be.null;
            done();
        });
        it('.getValues() should output in same order recieved', function (done) {
            expect(g.getValues()).to.eql(['1', '2', '3', '*']);
            done();
        });
        it('.getMissingVal() should be set to *', function (done) {
            g.setMissingVal('*');
            expect(g.getMissingVal()).to.equal('*');
            done();
        });
        it('.getValues() should output missing first', function (done) {
            expect(g.getValues()).to.eql(['*', '1', '2', '3']);
            done();
        });
        it('.getColumn() should be equal to input column', function (done) {
            expect(g.getColumn()).to.eql(in_column);
            done();
        });
        it('.getCell() should output the correct cell', function (done) {
            for (var i = 0; i < in_column.length; i++) {
                expect(g.getCell(i)).to.equal(in_column[i]);
            }
            done();
        });
        it('.getCell() should throw RangeError', function (done) {
            expect(function () { g.getCell(in_column.length); }).to.throw(RangeError);
            done();
        });
    });
});

//# sourceMappingURL=../test/graph_node.js.map