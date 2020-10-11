import assert from 'assert';
import chai from 'chai';
let expect = chai.expect;
let should = chai.should;

import Vec2 from '../src/sharedJS/vec2.js';
import { Circle, Rectangle } from '../src/sharedJS/shapes.js';
import Point from '../src/sharedJS/point.js';

describe('Shapes', function () {
    describe('Circle', function () {
        let center = new Vec2(1,2);
        let circle = new Circle(center, 5);

        //test constructor
        it('Circle constructor', function () {
            let test = new Circle(center, 3);
            assert.strictEqual(test.center.x, 1);
            assert.strictEqual(test.center.y, 2);
            assert.strictEqual(test.radius, 3);
        });

        //Check width of circle
        it('width', function () {
            assert.strictEqual(circle.width, 10);
            assert.strictEqual(circle.halfWidth, 5);
        });

        //Contains tests
        it('contains centered', function () {
            let point = new Point(new Vec2(1,2));
            assert.strictEqual(circle.contains(point), true);
        });

        it('contains inside', function () {
            let point = new Point(new Vec2(2,2));
            assert.strictEqual(circle.contains(point), true);
        });

        it('contains edge', function () {
            let point = new Point(new Vec2(1,7));
            assert.strictEqual(circle.contains(point), true);
        });

        it('contains outside', function () {
            let point = new Point(new Vec2(1,10));
            assert.strictEqual(circle.contains(point), false);
        });

        //Intersects circle tests
        it('intersects circle centered', function () {
            let circleRange = new Circle(new Vec2(1,2), 2);
            assert.strictEqual(circle.intersects(circleRange), true);
        });

        it('intersects circle inside', function () {
            let circleRange = new Circle(new Vec2(2,2), 2);
            assert.strictEqual(circle.intersects(circleRange), true);
        });

        it('intersects circle edge', function () {
            let circleRange = new Circle(new Vec2(1,9), 2);
            assert.strictEqual(circle.intersects(circleRange), true);
        });

        it('intersects circle outside', function () {
            let circleRange = new Circle(new Vec2(1,10), 2);
            assert.strictEqual(circle.intersects(circleRange), false);
        });

        //Intersects rectangle tests
        it('intersects rectangle centered', function () {
            let rectangleRange = new Rectangle(new Vec2(1,2), 5, 2);
            assert.strictEqual(circle.intersects(rectangleRange), true);
        });

        it('intersects rectangle inside', function () {
            let rectangleRange = new Rectangle(new Vec2(2,2), 5, 2);
            assert.strictEqual(circle.intersects(rectangleRange), true);
        });

        it('intersects rectangle edge', function () {
            let rectangleRange = new Rectangle(new Vec2(7,2), 2, 2);
            assert.strictEqual(circle.intersects(rectangleRange), true);
        });

        it('intersects rectangle outside', function () {
            let rectangleRange = new Rectangle(new Vec2(1,10), 5, 2);
            assert.strictEqual(circle.intersects(rectangleRange), false);
        });
    });

    describe('Rectangle', function () {
        let center = new Vec2(1,2);
        let rectangle = new Rectangle(center, 4, 4);

        //test constructor
        it('Rectangle constructor', function () {
            let test = new Rectangle(center, 3, 4);
            assert.strictEqual(test.center.x, 1);
            assert.strictEqual(test.center.y, 2);
            assert.strictEqual(test.width, 3);
            assert.strictEqual(test.height, 4);
        });

        //Check boundries of Rectangle
        it('boundries', function () {
            assert.strictEqual(rectangle.width, 4);
            assert.strictEqual(rectangle.halfWidth, 2);
            assert.strictEqual(rectangle.left, -1);
            assert.strictEqual(rectangle.right, 3);
            assert.strictEqual(rectangle.top, 0);
            assert.strictEqual(rectangle.bottom, 4);
        });

        //Contains tests
        it('contains centered', function () {
            let point = new Point(new Vec2(1,2));
            assert.strictEqual(rectangle.contains(point), true);
        });

        it('contains inside', function () {
            let point = new Point(new Vec2(2,2));
            assert.strictEqual(rectangle.contains(point), true);
        });

        it('contains edge', function () {
            let point = new Point(new Vec2(1,4));
            assert.strictEqual(rectangle.contains(point), true);
        });

        it('contains outside', function () {
            let point = new Point(new Vec2(1,10));
            assert.strictEqual(rectangle.contains(point), false);
        });

        //Intersects circle tests
        it('intersects circle centered', function () {
            let circleRange = new Circle(new Vec2(1,2), 2);
            assert.strictEqual(rectangle.intersects(circleRange), true);
        });

        it('intersects circle inside', function () {
            let circleRange = new Circle(new Vec2(2,2), 2);
            assert.strictEqual(rectangle.intersects(circleRange), true);
        });

        it('intersects circle edge', function () {
            let circleRange = new Circle(new Vec2(1,6), 2);
            assert.strictEqual(rectangle.intersects(circleRange), true);
        });

        it('intersects circle outside', function () {
            let circleRange = new Circle(new Vec2(1,10), 2);
            assert.strictEqual(rectangle.intersects(circleRange), false);
        });

        //Intersects rectangle tests
        it('intersects rectangle centered', function () {
            let rectangleRange = new Rectangle(new Vec2(1,2), 5, 2);
            assert.strictEqual(rectangle.intersects(rectangleRange), true);

            rectangleRange = new Rectangle(new Vec2(1,2), 2, 5);
            assert.strictEqual(rectangle.intersects(rectangleRange), true);
        });

        it('intersects rectangle inside', function () {
            let rectangleRange = new Rectangle(new Vec2(2,2), 5, 2);
            assert.strictEqual(rectangle.intersects(rectangleRange), true);
        });

        it('intersects rectangle edge', function () {
            let rectangleRange = new Rectangle(new Vec2(1,5), 5, 2);
            assert.strictEqual(rectangle.intersects(rectangleRange), true);
        });

        it('intersects rectangle outside', function () {
            let rectangleRange = new Rectangle(new Vec2(1,10), 5, 2);
            assert.strictEqual(rectangle.intersects(rectangleRange), false);
        });
    });
});
