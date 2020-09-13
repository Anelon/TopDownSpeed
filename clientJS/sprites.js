import TileSprite from "./tileSprite.js";

const tileMapPath = "/img/tileMaps/";
const tileSprites = new Map(
    [
        ["grassTile", new TileSprite(tileMapPath + "grasstiles.png", "g", ["g", "d"])],
        ["snowTile", new TileSprite(tileMapPath + "snowTiles.png", "s")],
        ["dirtTile", new TileSprite(tileMapPath + "dirtPathTiles.png", "d")],
        ["waterTile", new TileSprite(tileMapPath + "waterTiles.png", "w")],
    ]
);
Object.freeze(tileSprites);

const sprites = new Map(
    [
    ]

);
Object.freeze(sprites);

export { sprites, tileSprites };