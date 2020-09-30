import ObjectiveRegion from "../map/objectiveRegion.js";
import Region from "../map/region.js";
import SpawnRegion from "../map/spawnRegion.js";
import Tile from "../map/tile.js";
import VictoryMonument from "../map/victoryMonument.js";
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
    region: "region",
    tile: "tile",
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
    v: "void",
    " ": "none",
}
//lock the enum
Object.freeze(CATEGORY);
const TILES = {
    [TILE_NAMES.g]: new Tile(new Vec2(), TILE_NAMES.g, true, true, 0),
    [TILE_NAMES.s]: new Tile(new Vec2(), TILE_NAMES.s, true, true, 0),
    [TILE_NAMES.d]: new Tile(new Vec2(), TILE_NAMES.d, true, true, 0),
    [TILE_NAMES.w]: new Tile(new Vec2(), TILE_NAMES.w, false, true, 0),
    [TILE_NAMES[" "]]: new Tile(new Vec2(), TILE_NAMES[" "], true, true, 0),
}
//lock the enum
Object.freeze(TILES);

const TILE_OPTIONS = new Set(["walkable", "passable"]);
//lock the enum
Object.freeze(TILE_OPTIONS);

const REGIONS = {
    "pvp": Region,
    "pvpObjective": ObjectiveRegion,
    "pve": Region,
    "pveObjective": ObjectiveRegion,
    "puzzle": Region,
    "puzzleObjective": ObjectiveRegion,
    "vm": VictoryMonument,
    "spawn": SpawnRegion,
}
//lock the enum
Object.freeze(REGIONS);

const OBJECTIVE_COLORS = {
    "pvpObjective": "red",
    "pveObjective": "blue",
    "puzzleObjective": "yellow",
    "spawn": "green",
}
//lock the enum
Object.freeze(OBJECTIVE_COLORS);

export { TYPES, CATEGORY, TILE_NAMES, TILES, TILE_OPTIONS, REGIONS, OBJECTIVE_COLORS };