import chai from 'chai';
let assert = chai.assert;
let expect = chai.expect;
let should = chai.should;

import Entity from "../sharedJS/entity.js";
import { Circle, Rectangle } from '../sharedJS/shapes.js';
import Point from "../sharedJS/point.js";
import Vec2 from '../sharedJS/vec2.js';
import Time from "../serverJS/serverTime.js";


describe('Entity', function () {
    //variables for entity testing
    let location = new Vec2(1, 2);
    let imgSrc = "img/test.png";
    let hitbox = new Circle(location, 8);
    let speed = 100;
    let entity = new Entity(location, imgSrc, hitbox, speed);

    //reset entity before each test
    beforeEach(function() {
        entity = new Entity(location, imgSrc, hitbox, speed);
    });

    context('Constructor', function () {
        it('Contructor made an entity', function () {
            assert(entity.location.equals(location), "Location is not set correctly");
            assert.strictEqual(entity.imgSrc, imgSrc, "ImgSrc not set correctly");
            assert(entity.hitbox, hitbox, "Hitbox not set correctly");
            assert.strictEqual(entity.speed, speed, "Speed not set correctly");
            assert(entity.lookDirection.equals(new Vec2(1,0)), "Default look not set correctly");
        });
    });

    context('Make functions', function () {
        it('makePoint() makes a Point', function () {
            let expectedPoint = new Point(location, entity, 8);
            let point = entity.makePoint();
            assert.instanceOf(point, Point);
            expect(point).to.eql(expectedPoint);
            //assert(point.equals(expectedPoint), "Point not correctly generating a point correctly");
        });

        it('makeShape() makes a Circle', function () {
            let expectedShape = new Circle(location, 8);
            let shape = entity.makeShape();
            assert.instanceOf(shape, Circle);
            expect(shape).to.eql(expectedShape);

            expectedShape = new Circle(location, 16);
            shape = entity.makeShape(2);
            assert.instanceOf(shape, Circle);
            expect(shape).to.eql(expectedShape);
        });
    });
    context('Update and Move functions', function() {
        let time = null;
        beforeEach(function() {
            time = new Time(2, 1, 1, 1);
        });

        it("update with no speed doesn't move", function() {
            let expectedEntity = new Entity(location, imgSrc, hitbox, 0);
            //force id to be the same
            expectedEntity.id = entity.id;
            entity.speed = 0;
            entity.update(time, time.dt, null);
            expect(entity).to.eql(expectedEntity);
        });

        it("update with speed 100 and dt 1", function() {
            let expectedEntity = new Entity(location, imgSrc, hitbox, speed);
            expectedEntity.location.addS(new Vec2(1,0).multiplyScalarS(speed));
            //force id to be the same
            expectedEntity.id = entity.id;
            entity.update(time, time.dt, null);
            expect(entity).to.eql(expectedEntity);
        });
    });
});