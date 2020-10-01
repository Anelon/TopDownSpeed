import chai from 'chai';
let assert = chai.assert;
let expect = chai.expect;
let should = chai.should;
import QuadTree from "../sharedJS/quadTree.js";
import Vec2 from "../sharedJS/vec2.js";
import { Rectangle, Circle } from "../sharedJS/shapes.js";
import Point from "../sharedJS/point.js";

describe('QuadTree', function () {
    let boundary = new Rectangle(new Vec2(1, 1), 20, 20);
    let capacity = 10;
    let quadTree = new QuadTree(boundary, capacity);

    beforeEach(function () {
        quadTree = new QuadTree(boundary, capacity);
    });

    context('Constructor', function () {
        it('Contructor made an quadTree', function () {
            expect(quadTree.boundary).to.eql((boundary), "Boundary is not set correctly");
            expect(quadTree.capacity).to.eql((capacity), "Capacity is not set correctly");
        });
    });
});
