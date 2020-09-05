import chai from 'chai';
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should;

import Entity from "../sharedJS/entity.js";
import Player from "../sharedJS/player.js";
import { Circle, Rectangle } from '../sharedJS/shapes.js';
import Point from "../sharedJS/point.js";
import Vec2 from '../sharedJS/vec2.js';
import Time from "../serverJS/serverTime.js";


describe('Player', function () {
    //variables for entity testing
    const location = new Vec2(1, 2);
    const imgSrc = "img/test.png";
    const hitbox = new Circle(location, 8);
    const speed = 100;
    const health = 200;
    const name = "testPlayer";
    let player = new Player(location, name, imgSrc, speed, health);

    //reset player before each test
    beforeEach(function() {
        player = new Player(location, name, imgSrc, speed, health);
    });

    context('Constructor', function () {
        it('Contructor made an player', function () {
            assert(player.location.equals(location), "Location is not set correctly");
            assert.strictEqual(player.imgSrc, imgSrc, "ImgSrc not set correctly");
            assert(player.hitbox, hitbox, "Hitbox not set correctly");
            assert.strictEqual(player.speed, speed, "Speed not set correctly");
            assert(player.lookDirection.equals(new Vec2(1,0)), "Default look not set correctly");
        });
    });

    context('Make functions', function () {
        it('makePoint() makes a Point', function () {
            let expectedPoint = new Point(location, player, 8);
            let point = player.makePoint();
            assert.instanceOf(point, Point);
            expect(point).to.eql(expectedPoint);
            //assert(point.equals(expectedPoint), "Point not correctly generating a point correctly");
        });

        it('makeShape() makes a Circle', function () {
            let expectedShape = new Circle(location, 8);
            let shape = player.makeShape();
            assert.instanceOf(shape, Circle);
            expect(shape).to.eql(expectedShape);

            expectedShape = new Circle(location, 16);
            shape = player.makeShape(2);
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
            let expectedPlayer = new Player(location, name, imgSrc, 0, health);
            //force id to be the same
            expectedPlayer.id = player.id;
            player.speed = 0;
            player.update(time, time.dt, null);
            expect(player).to.eql(expectedPlayer);
        });

        it("update with speed 100 and dt 1", function() {
            let expectedPlayer = new Player(location, name, imgSrc, speed, health);
            expectedPlayer.location.addS(new Vec2(1,0).multiplyScalarS(speed));
            //force id to be the same
            expectedPlayer.id = player.id;
            player.update(time, time.dt, null);
            expect(player).to.eql(expectedPlayer);
        });
    });
    context('Make Object', function() {
        it('Check everything is attached to Make Object', function() {
            const object = player.makeObject();
            expect(object.type).to.eql("Player");
            const updated = JSON.parse(object.json);
            expect(updated.currHealth).to.eql(health);
            expect(updated.maxHealth).to.eql(health);
            expect(updated.location).to.eql(location);
            expect(updated.speed).to.eql(speed);
            expect(updated.hitbox).to.eql(hitbox);
        });
    });
    //TODO add tests for hit when hit is written
});