import assert from 'assert';
import chai from 'chai';
let expect = chai.expect;
let should = chai.should;
import Vec2 from '../sharedJS/vec2.js';
import { Circle, Rectangle } from '../sharedJS/shapes.js';
import Point from '../sharedJS/point.js';
import Entity from '../sharedJS/entity.js';

//Ya not much to test here
describe('Point', function () {
    describe('Point', function () {
        let center = new Vec2(1,2);
        let owner = new Entity(center, "test", new Circle(center, 5));

        //test constructor
        it('Point constructor', function () {
            let test = new Point(center, owner, 3);
            assert.equal(test.location.x, 1);
            assert.equal(test.location.y, 2);
            assert.equal(test.x, 1);
            assert.equal(test.y, 2);
            assert.equal(test.radius, 3);
        });
    });
});
