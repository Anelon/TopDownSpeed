import Vec2 from "../vec2.js";
import Projectile from "../ability/projectile.js";
import { Circle } from "../shapes.js";
import Fireball from "../ability/fireball.js";
import Waterball from "../ability/waterball.js";
import PlantSeed from "../ability/plantSeed.js";

/**
 * @param {{ json: string; type: string; }} object
 */
export function projectileFromJSON(object) {
    const data = JSON.parse(object.json);
    if(object.type === "Projectile") {
        return Projectile.makeFromJSON(data);
    }

    //destructure data object
    const {
        location, name, speed, scale, lookDirection, range, hitbox, damage, owner
    } = data;
    const loc = new Vec2(location.x, location.y);

    //construct based on object type
    if (object.type === "Fireball") {
        return new Fireball(
            loc, name, speed, scale, new Vec2(lookDirection.x, lookDirection.y), range, damage, new Circle(loc, hitbox.radius), owner
        );
    }
    else if (object.type === "Waterball") {
        return new Waterball(
            loc, name, speed, scale, new Vec2(lookDirection.x, lookDirection.y), range, damage, new Circle(loc, hitbox.radius), owner
        );
    }
    else if (object.type === "PlantSeed") {
        return new PlantSeed(
            loc, name, speed, scale, new Vec2(lookDirection.x, lookDirection.y), range, damage, new Circle(loc, hitbox.radius), owner
        );
    }
    return Projectile.makeFromJSON(data);
}

/**
 * Waits given miliseconds
 * @param {number} ms 
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}