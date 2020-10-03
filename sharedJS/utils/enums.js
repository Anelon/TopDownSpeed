import ObjectiveRegion from "../map/objectiveRegion.js";
import PVEObjectiveRegion from "../map/pveObjectiveRegion.js";
import PVERegion from "../map/PVERegion.js";
import Region from "../map/region.js";
import SpawnRegion from "../map/spawnRegion.js";
import Tile from "../map/tile.js";
import VictoryMonument from "../map/victoryMonument.js";
import Vec2 from "../vec2.js";

//Enum of the type strings for consistency
export const TYPES = {
    //ability types
    basic: "basic",
    fire: "fire",
    water: "water",
    plant: "plant",
}
//lock the enum
Object.freeze(TYPES);

export const CATEGORY = {
    //terain types
    region: "region",
    tile: "tile",
    void: "void",
    //can be damaged
    damageable: "damageable",
    player: "player",
    dragon: "dragon",
    //Projectile
    projectile: "projectile",
    //base
    none: "none"
}
//lock the enum
Object.freeze(CATEGORY);

export const TILE_NAMES = {
    g: "grass",
    s: "snow",
    d: "dirt",
    w: "water",
    u: "dungeon",
    v: "void",
    " ": "none",
}
//lock the enum
Object.freeze(TILE_NAMES);

export const DECORATION_NAMES = {
    redPillar: "redPillar",
    bluePillar: "bluePillar",
    greenPillar: "greenPillar",
}
//lock the enum
Object.freeze(DECORATION_NAMES);

export const TILES = {
    [TILE_NAMES.g]: new Tile(new Vec2(), TILE_NAMES.g, true, true, 0),
    [TILE_NAMES.s]: new Tile(new Vec2(), TILE_NAMES.s, true, true, 0),
    [TILE_NAMES.d]: new Tile(new Vec2(), TILE_NAMES.d, true, true, 0),
    [TILE_NAMES.w]: new Tile(new Vec2(), TILE_NAMES.w, false, true, 0),
    [TILE_NAMES.u]: new Tile(new Vec2(), TILE_NAMES.u, true, true, 0),
    [DECORATION_NAMES.redPillar]: new Tile(new Vec2(), DECORATION_NAMES.redPillar, false, true, 0),
    [DECORATION_NAMES.bluePillar]: new Tile(new Vec2(), DECORATION_NAMES.bluePillar, false, true, 0),
    [DECORATION_NAMES.greenPillar]: new Tile(new Vec2(), DECORATION_NAMES.greenPillar, false, true, 0),
    [TILE_NAMES[" "]]: new Tile(new Vec2(), TILE_NAMES[" "], true, true, 0),
}
//lock the enum
Object.freeze(TILES);

export const TILE_OPTIONS = new Set(["walkable", "passable"]);
//lock the enum
Object.freeze(TILE_OPTIONS);

export const REGIONS = {
    "pvp": Region,
    "pvpObjective": ObjectiveRegion,
    "pve": PVERegion,
    "pveObjective": PVEObjectiveRegion,
    "puzzle": Region,
    "puzzleObjective": ObjectiveRegion,
    "victoryMonument": VictoryMonument,
    "spawn": SpawnRegion,
}
//lock the enum
Object.freeze(REGIONS);

export const NUM_OBJECTIVES = 3;
export const OBJECTIVE_COLORS = {
    "pvpObjective": "red",
    "pveObjective": "blue",
    "puzzleObjective": "green",
    "spawn": "yellow",
}
//lock the enum
Object.freeze(OBJECTIVE_COLORS);

export const MaxPlayers = 6;
export const MinPlayers = 2;
