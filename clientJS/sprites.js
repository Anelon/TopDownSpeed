import TileSprite from "./tileSprite.js";
import { TILE_NAMES } from "../sharedJS/utils/enums.js";

const tileMapPath = "/img/tileMaps/";
//TODO figure out why dungeonTiles isn't working
const tileSprites = new Map(
    [
        [TILE_NAMES.g, new TileSprite(tileMapPath + "grasstiles.png", TILE_NAMES.g, [TILE_NAMES.g, TILE_NAMES.d])],
        [TILE_NAMES.s, new TileSprite(tileMapPath + "snowTiles.png", TILE_NAMES.s)],
        [TILE_NAMES.d, new TileSprite(tileMapPath + "dirtPathTiles.png", TILE_NAMES.d)],
        [TILE_NAMES.w, new TileSprite(tileMapPath + "waterTiles.png", TILE_NAMES.w)],
        [TILE_NAMES.u, new TileSprite(tileMapPath + "dungeonTiles.png", TILE_NAMES.u)],
    ]
);
Object.freeze(tileSprites);

const sprites = new Map(
    [
    ]
);
Object.freeze(sprites);

export { sprites, tileSprites };