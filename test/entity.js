import chai from 'chai';
let assert = chai.assert;
let expect = chai.expect;
// @ts-ignore
let should = chai.should;

import Entity from "../src/sharedJS/entity.js";
import { Circle, Rectangle } from '../src/sharedJS/shapes.js';
import Point from "../src/sharedJS/point.js";
import Vec2 from '../src/sharedJS/vec2.js';
import Time from "../src/sharedJS/utils/time.js";
import { performance } from "perf_hooks";


describe('Entity', function () {
    //variables for entity testing
    let location = new Vec2(1, 2);
    let imgSrc = "test";
    let hitbox = new Circle(location, 8);
    let speed = 100;
    let entity = new Entity(location, imgSrc, hitbox, speed);

    //reset entity before each test
    beforeEach(function() {
        entity = new Entity(location, imgSrc, hitbox, speed);
    });

    context('Constructor', function () {
        it('Contructor made an entity', function () {
            expect(entity.location).to.eql((location), "Location is not set correctly");
            assert.strictEqual(entity.imgSrc, imgSrc, "ImgSrc not set correctly");
            expect(entity.hitbox).to.eql(hitbox, "Hitbox not set correctly");
            assert.strictEqual(entity.speed, speed, "Speed not set correctly");
            assert(entity.lookDirection.equals(new Vec2(1,0)), "Default look not set correctly");
        });
    });

    context('Make functions', function () {
        it('makePoint() makes a Point', function () {
            let expectedPoint = new Point(location, 8, entity);
            let point = entity.makePoint();
            assert.instanceOf(point, Point);
            expect(point).to.eql(expectedPoint);
            //assert(point.strictEquals(expectedPoint), "Point not correctly generating a point correctly");
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
            time = new Time(performance, 2, 1, 1, 1);
        });

        it("update with no speed doesn't move", function() {
            let expectedEntity = new Entity(location, imgSrc, hitbox, 0);
            //force id to be the same
            expectedEntity.id = entity.id;
            entity.speed = 0;
            // @ts-ignore
            entity.update(time, time.dt, null);
            expect(entity).to.eql(expectedEntity);
        });

        it("update with speed 100 and dt 1", function() {
            let expectedEntity = new Entity(location, imgSrc, hitbox, speed);
            expectedEntity.location.addS(new Vec2(1,0).multiplyScalarS(speed));
            //force id to be the same
            expectedEntity.id = entity.id;
            // @ts-ignore
            entity.update(time, time.dt, null);
            expect(entity).to.eql(expectedEntity);
        });
    });
});
