import TileSprite from "./tileSprite.js";
import { TILE_NAMES } from "../sharedJS/utils/enums.js";

const tileMapPath = "/img/tileMaps/";
const tileSprites = new Map(
    [
        [TILE_NAMES.g, new TileSprite(tileMapPath + "grasstiles.png", "g", ["g", "d"])],
        [TILE_NAMES.s, new TileSprite(tileMapPath + "snowTiles.png", "s")],
        [TILE_NAMES.d, new TileSprite(tileMapPath + "dirtPathTiles.png", "d")],
        [TILE_NAMES.w, new TileSprite(tileMapPath + "waterTiles.png", "w")],
    ]
);
Object.freeze(tileSprites);

const sprites = new Map(
    [
    ]
);
Object.freeze(sprites);

export { sprites, tileSprites };