import chai from 'chai';
let assert = chai.assert;
let expect = chai.expect;
let should = chai.should;

import Entity from "../sharedJS/entity.js";
import { Circle, Rectangle } from '../sharedJS/shapes.js';
import Point from "../sharedJS/point.js";
import Vec2 from '../sharedJS/vec2.js';


describe('Entity', function () {
    let entity = null;
    //variables for entity testing
    let location = new Vec2(1, 2);
    let imgSrc = "img/test.png";
    let hitbox = new Circle(location, 16);
    let speed = 100;

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
        it('Make Point makes a Point', function () {
            let point = new Point(location, entity, );
            assert(entity.location.equals(location), "Location is not set correctly");
            assert.equal(entity.imgSrc, imgSrc, "ImgSrc not set correctly");
            assert.equal(entity.hitbox, hitbox, "Hitbox not set correctly");
            assert.equal(entity.speed, speed, "Speed not set correctly");
            assert(entity.lookDirection.equals(new Vec2(1,0)), "Default look not set correctly");
        });
    });
});