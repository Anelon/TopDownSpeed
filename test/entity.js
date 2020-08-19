import chai from 'chai';
let assert = chai.assert;
let expect = chai.expect;
let should = chai.should;

import Entity from "../sharedJS/entity.mjs";
import { Circle, Rectangle } from '../sharedJS/shapes.mjs';
import Vec2 from '../sharedJS/vec2.mjs';


describe('Entity', function () {
    describe('Constructor', function () {
        it('Should make an entity', function () {
            let location = new Vec2(1,2);
            let imgSrc = "img/test.png";
            let hitbox = new Circle(location, 16);
            let speed = 100;
            let entity = new Entity(location, imgSrc, hitbox,speed);

            assert.equal(entity.x, 1);
            assert.equal(entity.y, 2);
        });
    });
});