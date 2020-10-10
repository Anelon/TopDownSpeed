import TileSprite from "./tileSprite.js";
import { DECORATION_NAMES, TILE_NAMES } from "../sharedJS/utils/enums.js";
import DecorationSprite from "./decorationSprite.js";

//TODO resize dungeonTiles image is wrong size
export const tileSprites = new Map();
//TODO refactor into greater load function somewhere
export function loadTileSprites() {
    tileSprites.set(TILE_NAMES.g, new TileSprite("grassTiles", TILE_NAMES.g, [TILE_NAMES.g, TILE_NAMES.d]));
    tileSprites.set(TILE_NAMES.s, new TileSprite("snowTiles", TILE_NAMES.s));
    tileSprites.set(TILE_NAMES.d, new TileSprite("dirtPathTiles", TILE_NAMES.d));
    tileSprites.set(TILE_NAMES.w, new TileSprite("waterTiles", TILE_NAMES.w));
    tileSprites.set(TILE_NAMES.u, new TileSprite("dungeonTiles", TILE_NAMES.u));
}

export const ACTIVE = "Active";
export const decorationSprites = new Map(
);
export function loadDecorationSprites() {
    tileSprites.set(DECORATION_NAMES.redPillar + ACTIVE, new DecorationSprite("redPillarActive", "R"));
    tileSprites.set(DECORATION_NAMES.redPillar, new DecorationSprite("redPillar", "r"));
    tileSprites.set(DECORATION_NAMES.bluePillar + ACTIVE, new DecorationSprite("bluePillarActive", "B"));
    tileSprites.set(DECORATION_NAMES.bluePillar, new DecorationSprite("bluePillar", "b"));
    tileSprites.set(DECORATION_NAMES.greenPillar + ACTIVE, new DecorationSprite("greenPillarActive", "G"));
    tileSprites.set(DECORATION_NAMES.greenPillar, new DecorationSprite("greenPillar", "g"));

}

export const sprites = new Map(
    [
    ]
);
Object.freeze(sprites);

export const dragonImages = new Map();
export const dragonAnimationWidths = new Map();
