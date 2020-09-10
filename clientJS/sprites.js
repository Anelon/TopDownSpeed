import Sprite from "./sprite.js";
import TileSprite from "./tileSprite.js";
import FireballAbility from "../sharedJS/fireballAbility.js";
import Entity from "../sharedJS/entity.js";

const tileMapPath = "/img/tileMaps/";
const tileSprites = new Map(
    [
        ["grassTileMap", new TileSprite(tileMapPath + "grasstiles.png", "g", ["g", "d"])],
        ["snowTileMap", new TileSprite(tileMapPath + "snowTiles.png", "s")],
        ["dirtTileMap", new TileSprite(tileMapPath + "dirtPathTiles.png", "d")],
        ["waterTileMap", new TileSprite(tileMapPath + "waterTiles.png", "w")],
    ]
);
Object.freeze(tileSprites);

const sprites = new Map(
    [
        [FireballAbility.name, "something"],
    ]

);
Object.freeze(sprites);

export { sprites, tileSprites };