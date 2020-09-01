import assert from 'assert';
import chai from 'chai';
let expect = chai.expect;
let should = chai.should;
import Vec2 from '../sharedJS/vec2.js';
import { Circle, Rectangle } from '../sharedJS/shapes.js';
import Point from '../sharedJS/point.js';

describe('Shapes', function () {
    describe('Circle', function () {
        let center = new Vec2(1,2);
        let circle = new Circle(center, 5);

        //test constructor
        it('Circle constructor', function () {
            let test = new Circle(center, 3);
            assert.equal(test.center.x, 1);
            assert.equal(test.center.y, 2);
            assert.equal(test.radius, 3);
        });

        //Check width of circle
        it('width', function () {
            assert.equal(circle.width, 10);
            assert.equal(circle.halfWidth, 5);
        });

        //Contains tests
        it('contains centered', function () {
            let point = new Point(new Vec2(1,2));
            assert.equal(circle.contains(point), true);
        });

        it('contains inside', function () {
            let point = new Point(new Vec2(2,2));
            assert.equal(circle.contains(point), true);
        });

        it('contains edge', function () {
            let point = new Point(new Vec2(1,7));
            assert.equal(circle.contains(point), true);
        });

        it('contains outside', function () {
            let point = new Point(new Vec2(1,10));
            assert.equal(circle.contains(point), false);
        });

        //Intersects circle tests
        it('intersects circle centered', function () {
            let circleRange = new Circle(new Vec2(1,2), 2);
            assert.equal(circle.intersects(circleRange), true);
        });

        it('intersects circle inside', function () {
            let circleRange = new Circle(new Vec2(2,2), 2);
            assert.equal(circle.intersects(circleRange), true);
        });

        it('intersects circle edge', function () {
            let circleRange = new Circle(new Vec2(1,9), 2);
            assert.equal(circle.intersects(circleRange), true);
        });

        it('intersects circle outside', function () {
            let circleRange = new Circle(new Vec2(1,10), 2);
            assert.equal(circle.intersects(circleRange), false);
        });

        //Intersects rectangle tests
        it('intersects rectangle centered', function () {
            let rectangleRange = new Rectangle(new Vec2(1,2), 5, 2);
            assert.equal(circle.intersects(rectangleRange), true);
        });

        it('intersects rectangle inside', function () {
            let rectangleRange = new Rectangle(new Vec2(2,2), 5, 2);
            assert.equal(circle.intersects(rectangleRange), true);
        });

        it('intersects rectangle edge', function () {
            let rectangleRange = new Rectangle(new Vec2(1,9), 5, 2);
            assert.equal(circle.intersects(rectangleRange), true);
        });

        it('intersects rectangle outside', function () {
            let rectangleRange = new Rectangle(new Vec2(1,10), 5, 2);
            assert.equal(circle.intersects(rectangleRange), false);
        });
    });

    describe('Rectangle', function () {
        let center = new Vec2(1,2);
        let rectangle = new Rectangle(center, 4, 4);

        //test constructor
        it('Rectangle constructor', function () {
            let test = new Rectangle(center, 3, 4);
            assert.equal(test.center.x, 1);
            assert.equal(test.center.y, 2);
            assert.equal(test.width, 3);
            assert.equal(test.height, 4);
        });

        //Check boundries of Rectangle
        it('boundries', function () {
            assert.equal(rectangle.width, 4);
            assert.equal(rectangle.halfWidth, 2);
            assert.equal(rectangle.left, -1);
            assert.equal(rectangle.right, 3);
            assert.equal(rectangle.top, 0);
            assert.equal(rectangle.bottom, 4);
        });

        //Contains tests
        it('contains centered', function () {
            let point = new Point(new Vec2(1,2));
            assert.equal(rectangle.contains(point), true);
        });

        it('contains inside', function () {
            let point = new Point(new Vec2(2,2));
            assert.equal(rectangle.contains(point), true);
        });

        it('contains edge', function () {
            let point = new Point(new Vec2(1,4));
            assert.equal(rectangle.contains(point), true);
        });

        it('contains outside', function () {
            let point = new Point(new Vec2(1,10));
            assert.equal(rectangle.contains(point), false);
        });

        //Intersects circle tests
        it('intersects circle centered', function () {
            let circleRange = new Circle(new Vec2(1,2), 2);
            assert.equal(rectangle.intersects(circleRange), true);
        });

        it('intersects circle inside', function () {
            let circleRange = new Circle(new Vec2(2,2), 2);
            assert.equal(rectangle.intersects(circleRange), true);
        });

        it('intersects circle edge', function () {
            let circleRange = new Circle(new Vec2(1,6), 2);
            assert.equal(rectangle.intersects(circleRange), true);
        });

        it('intersects circle outside', function () {
            let circleRange = new Circle(new Vec2(1,10), 2);
            assert.equal(rectangle.intersects(circleRange), false);
        });

        //Intersects rectangle tests
        it('intersects rectangle centered', function () {
            let rectangleRange = new Rectangle(new Vec2(1,2), 5, 2);
            assert.equal(rectangle.intersects(rectangleRange), true);

            rectangleRange = new Rectangle(new Vec2(1,2), 2, 5);
            assert.equal(rectangle.intersects(rectangleRange), true);
        });

        it('intersects rectangle inside', function () {
            let rectangleRange = new Rectangle(new Vec2(2,2), 5, 2);
            assert.equal(rectangle.intersects(rectangleRange), true);
        });

        it('intersects rectangle edge', function () {
            let rectangleRange = new Rectangle(new Vec2(1,5), 5, 2);
            assert.equal(rectangle.intersects(rectangleRange), true);
        });

        it('intersects rectangle outside', function () {
            let rectangleRange = new Rectangle(new Vec2(1,10), 5, 2);
            assert.equal(rectangle.intersects(rectangleRange), false);
        });
    });
});
