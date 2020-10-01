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
            let test = new Point(center, 3, owner);
            assert.strictEqual(test.center.x, 1);
            assert.strictEqual(test.center.y, 2);
            assert.strictEqual(test.x, 1);
            assert.strictEqual(test.y, 2);
            assert.strictEqual(test.radius, 3);
        });
    });
});
