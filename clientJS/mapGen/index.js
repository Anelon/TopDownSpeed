import Vec2 from "../../sharedJS/vec2.js";
import CanvasWrapper from "../canvasWrapper.js";
import TileSprite from "../tileSprite.js";
import { DIRS, DIRBITS } from "../../sharedJS/utils/dirsMap.js";
import { tileSprites } from "../sprites.js";
import GameMap from "../../sharedJS/map/gameMap.js"
import { TILES, TILE_NAMES } from "../../sharedJS/utils/enums.js";

//Globals
const gameMap = new GameMap(5, new Vec2(15, 200));
const tileSize = new Vec2(32,32);
let layerSelected = 1;
//set up canvas
const canvas = new CanvasWrapper({tileSize, canvasSize: gameMap.dimentions.clone().multiplyVecS(tileSize)});
let bounds = canvas.getBoundingClientRect();

let regionStart = new Vec2();
let regionEnd = new Vec2();
canvas.addEventListener("mousedown", function(e) {
    //console.log(e);
    const clickLocation = new Vec2(e.offsetX, e.offsetY);
    regionStart = clickLocation.multiplyVec(canvas.tileSize.invert()).floorS();
    //console.log(clickLocation.log(), regionStart.log());
});
canvas.addEventListener("mouseup", function(e) {
    //console.log(e);
    const clickLocation = new Vec2(e.offsetX, e.offsetY);
    console.log(canvas.tileSize.invert());
    regionEnd = clickLocation.multiplyVec(canvas.tileSize.invert()).floorS();
    //console.log(clickLocation.log(), regionEnd.log());
    gameMap.update(regionStart, regionEnd, TILES[TILE_NAMES.g], layerSelected);
});

let room = new Array();
let mobs = new Map();

/**
 * Updates the room from start to end with TileImage
 * @param {Vec2} regionStart 
 * @param {Vec2} regionEnd 
 * @param {TileSprite} tileSprite 
 */
function updateMap(regionStart, regionEnd, tileSprite) {
    console.assert(regionStart instanceof Vec2, "regionStart Not Vec2", regionStart);
    console.assert(regionEnd instanceof Vec2, "regionEnd Not Vec2", regionEnd);
    console.log(regionStart, regionEnd);
    //Get x and y locations
    let [startX, startY] = regionStart.getXY();
    let [endX, endY] = regionEnd.getXY();
    //if start is after end swap
    if(startX > endX)
        [startX, endX] = [endX, startX];
    if(startY > endY)
        [startY, endY] = [endY, startY];

    //build replacement string
    console.log(tileSprite);
    let newStr = "";
    for (let i = startX; i <= endX; i++) {
        newStr += tileSprite.char;
    }
    //for each y replace section
    for(let j = startY; j <= endY; j++) {
        room[j] = room[j].slice(0, startX) + newStr + room[j].slice(endX+1);
    }
    gameMap.draw(canvas);
}
