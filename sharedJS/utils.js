import Vec2 from "./vec2.js";
import Projectile from "./projectile.js";
import { TYPES } from "./enums.js";
import { Circle } from "./shapes.js";
import Fireball from "./fireball.js";
import Waterball from "./waterball.js";
import PlantSeed from "./plantSeed.js";

/**
 * @param {{ json: string; type: string; }} object
 */
export function makeFromJSON(object) {
    const data = JSON.parse(object.json);
    console.log(object.type);
    if(object.type === "Projectile") {
        return Projectile.makeFromJSON(data);
    }

    //destructure data object
    const {
        location, name, imgSrc, speed, scale, lookDirection, range, hitbox, damage, owner, type, category
    } = data;
    const loc = new Vec2(location.x, location.y);

    //construct based on object type
    if (object.type === "Fireball") {
        return new Fireball(
            loc, name, imgSrc, speed, scale, new Vec2(lookDirection.x, lookDirection.y), range, damage, new Circle(loc, hitbox.radius), owner
        );
    }
    else if (object.type === "Waterball") {
        return new Waterball(
            loc, name, imgSrc, speed, scale, new Vec2(lookDirection.x, lookDirection.y), range, damage, new Circle(loc, hitbox.radius), owner
        );
    }
    else if (object.type === "PlantSeed") {
        return new PlantSeed(
            loc, name, imgSrc, speed, scale, new Vec2(lookDirection.x, lookDirection.y), range, damage, new Circle(loc, hitbox.radius), owner
        );
    }
    return Projectile.makeFromJSON(data);
}