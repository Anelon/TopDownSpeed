import TileSprite from "./tileSprite.js";
import { DECORATION_NAMES, TILE_NAMES } from "../sharedJS/utils/enums.js";
import Drawable from "./drawable.js";
import DecorationSprite from "./decorationSprite.js";

const tileMapPath = "/img/tileMaps/";
//TODO figure out why dungeonTiles isn't working
export const tileSprites = new Map(
    [
        [TILE_NAMES.g, new TileSprite(tileMapPath + "grasstiles.png", TILE_NAMES.g, [TILE_NAMES.g, TILE_NAMES.d])],
        [TILE_NAMES.s, new TileSprite(tileMapPath + "snowTiles.png", TILE_NAMES.s)],
        [TILE_NAMES.d, new TileSprite(tileMapPath + "dirtPathTiles.png", TILE_NAMES.d)],
        [TILE_NAMES.w, new TileSprite(tileMapPath + "waterTiles.png", TILE_NAMES.w)],
        [TILE_NAMES.u, new TileSprite(tileMapPath + "dungeonTiles.png", TILE_NAMES.u)],
    ]
);
Object.freeze(tileSprites);

export const ACTIVE = "Active";
export const decorationSprite = new Map(
    [
        [DECORATION_NAMES.redPillar + ACTIVE, new DecorationSprite("/img/pillarRed/redPillarActive.png", "R")],
        [DECORATION_NAMES.redPillar, new DecorationSprite("/img/pillarRed/redPillar.png", "r")],
        [DECORATION_NAMES.bluePillar + ACTIVE, new DecorationSprite("/img/pillarBlue/bluePillarActive.png", "B")],
        [DECORATION_NAMES.bluePillar, new DecorationSprite("/img/pillarBlue/bluePillar.png", "b")],
        [DECORATION_NAMES.greenPillar + ACTIVE, new DecorationSprite("/img/pillarGreen/greenPillarActive.png", "G")],
        [DECORATION_NAMES.greenPillar, new DecorationSprite("/img/pillarGreen/greenPillar.png", "g")],
    ]
);

export const sprites = new Map(
    [
    ]
);
Object.freeze(sprites);
