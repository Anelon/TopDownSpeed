import TileSprite from "./tileSprite.js";
import { TILE_NAMES } from "../sharedJS/utils/enums.js";

const tileMapPath = "/img/tileMaps/";
const tileSprites = new Map(
    [
        [TILE_NAMES.grass, new TileSprite(tileMapPath + "grasstiles.png", "g", ["g", "d"])],
        [TILE_NAMES.snow, new TileSprite(tileMapPath + "snowTiles.png", "s")],
        [TILE_NAMES.dirt, new TileSprite(tileMapPath + "dirtPathTiles.png", "d")],
        [TILE_NAMES.water, new TileSprite(tileMapPath + "waterTiles.png", "w")],
    ]
);
Object.freeze(tileSprites);

const sprites = new Map(
    [
    ]
);
Object.freeze(sprites);

export { sprites, tileSprites };