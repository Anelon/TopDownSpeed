import Tile from "../map/tile.js";
import Vec2 from "../vec2.js";

//Enum of the type strings for consistency
const TYPES = {
    //ability types
    basic: "basic",
    fire: "fire",
    water: "water",
    plant: "plant",
}
//lock the enum
Object.freeze(TYPES);

const CATEGORY = {
    //terain types
    wall: "wall",
    void: "void",
    //can be damaged
    damageable: "damageable",
    player: "player",
    //Projectile
    projectile: "projectile",
    //base
    none: "none"
}
//lock the enum
Object.freeze(CATEGORY);

const TILE_NAMES = {
    g: "grass",
    s: "snow",
    d: "dirt",
    w: "water",
}
//lock the enum
Object.freeze(CATEGORY);
const TILES = {
    [TILE_NAMES.g]: new Tile(new Vec2(), TILE_NAMES.g, true, true, 0),
    [TILE_NAMES.s]: new Tile(new Vec2(), TILE_NAMES.s, true, true, 0),
    [TILE_NAMES.d]: new Tile(new Vec2(), TILE_NAMES.d, true, true, 0),
    [TILE_NAMES.w]: new Tile(new Vec2(), TILE_NAMES.w, false, true, 0),
}
//lock the enum
Object.freeze(TILES);

export { TYPES, CATEGORY, TILE_NAMES, TILES };