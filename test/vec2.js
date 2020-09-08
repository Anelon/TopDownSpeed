//import assert from 'assert';
import chai from 'chai';
let assert = chai.assert;
let expect = chai.expect;
let should = chai.should;
import Vec2 from '../sharedJS/vec2.js';

describe('Vec2', function () {
    describe('Default Constructor', function () {
        it('Should make a Vec2 {0,0}', function () {
            let vec = new Vec2();
            assert.equal(vec.x, 0, "Default Constructor x = 0");
            assert.equal(vec.y, 0, "Default Constructor y = 0");
            assert.equal(vec.equals(new Vec2(0,0)), true, "Checks against normal Constructor");
            expect(vec.log()).to.equal("{0,0}");
        });
    });

    describe('Constructor', function () {
        it('Should make a Vec2 {2,3}', function () {
            let vec = new Vec2(2,3);
            assert.equal(vec.x, 2);
            assert.equal(vec.y, 3);
            expect(vec.getXY()).to.eql([2,3]);
        });
    });

    describe('Length', function () {
        it('Length of a Vec2 {3,4} should be 5', function () {
            let vec = new Vec2(3,4);
            assert.equal(vec.length(), 5);
            assert.equal(vec.lengthSq(), 25);
        });
    });

    describe('Math', function () {
        let vec1, vec2;
        beforeEach(function() {
            vec1 = new Vec2(1, 3);
            vec2 = new Vec2(2, 1);
        });

        it('Add 2 Vec2', function () {
            //test default
            let add = vec1.add(vec2);
            assert.equal(add.x, 3);
            assert.equal(add.y, 4);
            //test set version
            add.addS(vec2);
            assert.equal(add.x, 5);
            assert.equal(add.y, 5);
        });

        it('Subtract 2 Vec2', function () {
            //test default 
            let sub = vec1.sub(vec2);
            assert.equal(sub.x, -1);
            assert.equal(sub.y, 2);
            //test set version
            sub.subS(vec2);
            assert.equal(sub.x, -3);
            assert.equal(sub.y, 1);
        });

        it('Multiply Scalar Vec2', function () {
            //test default
            let muls = vec1.multiplyScalar(2);
            assert.equal(muls.x, 2);
            assert.equal(muls.y, 6);
            //test set version
            muls.multiplyScalarS(5);
            assert.equal(muls.x, 10);
            assert.equal(muls.y, 30);
        });

        it('Unit Vec2', function () {
            let unitTest = new Vec2(5,5);
            //test default
            let unit = unitTest.getUnit();
            expect(unit.x).to.be.closeTo(0.7071, 0.001);
            expect(unit.y).to.be.closeTo(0.7071, 0.001);
            //test set version
            unitTest.makeUnit();
            expect(unitTest.x).to.be.closeTo(0.7071, 0.001);
            expect(unitTest.y).to.be.closeTo(0.7071, 0.001);
        });

        it('dot product', function () {
            assert.equal(vec1.dot(vec2), 5);
        });

        it('floor', function () {
            let vec = new Vec2(3.5, 5.6);
            let test = vec.floor();
            expect(test).to.eql(new Vec2(3,5));
            vec.floorS();
            expect(vec).to.eql(new Vec2(3,5));
        });
    });
});
