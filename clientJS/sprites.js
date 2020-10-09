import TileSprite from "./tileSprite.js";
import { DECORATION_NAMES, TILE_NAMES } from "../sharedJS/utils/enums.js";
import DecorationSprite from "./decorationSprite.js";

//TODO figure out why dungeonTiles isn't working Solved image is wrong size
//TODO move creating TileSprites till after document loads
export const tileSprites = new Map(
    [
        [TILE_NAMES.g, new TileSprite("grassTiles", TILE_NAMES.g, [TILE_NAMES.g, TILE_NAMES.d])],
        [TILE_NAMES.s, new TileSprite("snowTiles", TILE_NAMES.s)],
        [TILE_NAMES.d, new TileSprite("dirtPathTiles", TILE_NAMES.d)],
        [TILE_NAMES.w, new TileSprite("waterTiles", TILE_NAMES.w)],
        [TILE_NAMES.u, new TileSprite("dungeonTiles", TILE_NAMES.u)],
    ]
);
Object.freeze(tileSprites);

export const ACTIVE = "Active";
export const decorationSprite = new Map(
    [
        [DECORATION_NAMES.redPillar + ACTIVE, new DecorationSprite("redPillarActive", "R")],
        [DECORATION_NAMES.redPillar, new DecorationSprite("redPillar", "r")],
        [DECORATION_NAMES.bluePillar + ACTIVE, new DecorationSprite("bluePillarActive", "B")],
        [DECORATION_NAMES.bluePillar, new DecorationSprite("bluePillar", "b")],
        [DECORATION_NAMES.greenPillar + ACTIVE, new DecorationSprite("greenPillarActive", "G")],
        [DECORATION_NAMES.greenPillar, new DecorationSprite("greenPillar", "g")],
    ]
);

export const sprites = new Map(
    [
    ]
);
Object.freeze(sprites);

export const dragonImages = new Map();
export const dragonAnimationWidths = new Map();
