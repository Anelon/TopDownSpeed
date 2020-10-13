import ObjectiveRegion from "../map/objectiveRegion.js";
import PVEObjectiveRegion from "../map/pveObjectiveRegion.js";
import PVERegion from "../map/pveRegion.js";
import Region from "../map/region.js";
import SpawnRegion from "../map/spawnRegion.js";
import Tile from "../map/tile.js";
import VictoryMonument from "../map/victoryMonument.js";
import Vec2 from "../vec2.js";

export const MaxPlayers = 6;
export const MinPlayers = 2;

export const NUM_OBJECTIVES = 3;

export const MAPNAME = "map";

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

export const VM_DECORATION = new Set(
    [
        DECORATION_NAMES.redPillar,
        DECORATION_NAMES.bluePillar,
        DECORATION_NAMES.greenPillar,
    ]
);
//lock the enum
Object.freeze(VM_DECORATION);

export const TILES = {
    [TILE_NAMES.g]: new Tile(new Vec2(), TILE_NAMES.g, true, true, false, 0),
    [TILE_NAMES.s]: new Tile(new Vec2(), TILE_NAMES.s, true, true, false, 0),
    [TILE_NAMES.d]: new Tile(new Vec2(), TILE_NAMES.d, true, true, false, 0),
    [TILE_NAMES.w]: new Tile(new Vec2(), TILE_NAMES.w, false, true, false, 0),
    [TILE_NAMES.u]: new Tile(new Vec2(), TILE_NAMES.u, true, true, false, 0),
    [DECORATION_NAMES.redPillar]: new Tile(new Vec2(), DECORATION_NAMES.redPillar, false, true, false, 0),
    [DECORATION_NAMES.bluePillar]: new Tile(new Vec2(), DECORATION_NAMES.bluePillar, false, true, false, 0),
    [DECORATION_NAMES.greenPillar]: new Tile(new Vec2(), DECORATION_NAMES.greenPillar, false, true, false, 0),
    [TILE_NAMES[" "]]: new Tile(new Vec2(), TILE_NAMES[" "], true, true, false, 0),
}
//lock the enum
Object.freeze(TILES);

export const TILE_OPTIONS = new Set(["walkable", "passable", "breakable"]);
//lock the enum
Object.freeze(TILE_OPTIONS);

export const REGION_NAMES = {
    pvp: "pvp",
    pve: "pve",
    puzzle: "puzzle",
    victoryMonument: "victoryMonument",
    pvpObjective: "pvpObjective",
    pveObjective: "pveObjective",
    puzzleObjective: "puzzleObjective",
    spawn: "spawn",
}
//lock the enum
Object.freeze(REGION_NAMES);

export const REGIONS = {
    [REGION_NAMES.pvp]: Region,
    [REGION_NAMES.pvpObjective]: ObjectiveRegion,
    [REGION_NAMES.pve]: PVERegion,
    [REGION_NAMES.pveObjective]: PVEObjectiveRegion,
    [REGION_NAMES.puzzle]: Region,
    [REGION_NAMES.puzzleObjective]: ObjectiveRegion,
    [REGION_NAMES.victoryMonument]: VictoryMonument,
    [REGION_NAMES.spawn]: SpawnRegion,
}
//lock the enum
Object.freeze(REGIONS);

export const OBJECTIVE_COLORS = {
    [REGION_NAMES.pvpObjective]: "red",
    [REGION_NAMES.pveObjective]: "blue",
    [REGION_NAMES.puzzleObjective]: "green",
    [REGION_NAMES.spawn]: "yellow",
}
//lock the enum
Object.freeze(OBJECTIVE_COLORS);
