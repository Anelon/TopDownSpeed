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
        id, location, name, speed, scale, lookDirection, range, hitbox, damage, owner
    } = data;
    const loc = new Vec2(location.x, location.y);
    const look = new Vec2(lookDirection.x, lookDirection.y);
    let projectile = null;

    //construct based on object type
    if (object.type === "Fireball") {
        projectile = new Fireball(
            loc, name, speed, scale, look, range, damage, new Circle(loc, hitbox.radius), owner
        );
    }
    else if (object.type === "Waterball") {
        projectile = new Waterball(
            loc, name, speed, scale, look, range, damage, new Circle(loc, hitbox.radius), owner
        );
    }
    else if (object.type === "PlantSeed") {
        projectile = new PlantSeed(
            loc, name, speed, scale, look, range, damage, new Circle(loc, hitbox.radius), owner
        );
    }
    if(!projectile) projectile = Projectile.makeFromJSON(data);
    projectile.id = id;

    return projectile;
}

/**
 * Waits given miliseconds
 * @param {number} ms 
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}