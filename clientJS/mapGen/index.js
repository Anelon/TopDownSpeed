import Vec2 from "../../sharedJS/vec2.js";
import CanvasWrapper from "../canvasWrapper.js";
import TileSprite from "../tileSprite.js";
import { DIRS, DIRBITS } from "../dirsMap.js";
import { tileSprites } from "../sprites.js";

//Globals
let width = 0;
let height = 0;
//set up canvas
const canvas = new CanvasWrapper({tileSize: new Vec2(32,32)});
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
    updateRoom(regionStart, regionEnd, tileSprites.get("grassTileMap"));
});

let room = new Array();
let mobs = new Map();



class Tile {
    /**
     * Constructor
     * @param {Vec2} location 
     * @param {TileSprite} tileSprite 
     * @param {boolean} isWalkable 
     * @param {number} around 
     */
    constructor(location, tileSprite, isWalkable, around) {
        console.assert((location instanceof Vec2), "Location not a Vec2", location);
        console.assert((tileSprite instanceof TileSprite), "tileSprite not a TileSprite", tileSprite);
        console.assert((typeof (isWalkable) === 'boolean'), "tileSprite not a TileImage", tileSprite);

        //location
        this.location = location;
        //image
        this.tileSprite = tileSprite;
        //walkable
        this.isWalkable = isWalkable;
        this.around = around;
    }
    /**
     * @param {CanvasWrapper} canvas 
     */
    draw(canvas) {
        this.tileSprite.draw(canvas, this.location, this.around);
    }
}

/**
 * Gets where each tile is around the current tile
 * @param {number} i X location of Tile
 * @param {number} j Y location of Tile
 * @param {Array} curr Array of tiles that can connect to
 */
function getAround(i, j, curr) {
    //console.log("getting Around");
    let around = 0;
    for (const dir of DIRS) {
        //console.log(dirs[dir]);
        let newI = dir.x + i;
        let newJ = dir.y + j;
        //if out of bounds count that as the tile
        if (newI < 0 || newJ < 0 || newI >= width || newJ >= height) {
            around = around | dir.dir;
            continue;
        }
        if (curr.includes(room[newJ][newI])) {
            around = around | dir.dir;
        }
    }
    return around;
}

function setTile(tileCoord, tileSprite) {
    room[tileCoord.y][tileCoord.x] = "g";
}

/**
 * Waits given miliseconds
 * @param {number} ms 
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function drawMap() {
    canvas.clear();
    height = room.length, width = room[0].length;
    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            const curr = room[j][i];
            for(const tileSprite of tileSprites.values()) {
                if (curr === tileSprite.char) {
                    const around = getAround(i, j, tileSprite.connects);
                    const tile = new Tile(new Vec2(i, j), tileSprite, false, around);
                    tile.draw(canvas);
                }
            }
            //await sleep(.01);
        }
    }
    canvas.drawGrid();
}

//TODO move to GameMap class
function mapInit() {
    //clear the room
    room = new Array();
    room.push("ggggddddddddddddgggg");
    room.push("ggggdgggggddddddgggg");
    room.push("gwwwwwwwwwgddggwwwwg");
    room.push("ggwwwwwwwwwgdgwwwwwg");
    room.push("ggggwggwwwwgggwwwwwg");
    room.push("ggggwgggwwwwgwwwwwwg");
    room.push("ggggggwwwwsssswwwwwg");
    room.push("gwwwwwwwwwsssswwwwwg");
    room.push("gwwwwwgggggwwwggwwwg");
    room.push("gwwwwwgggggwwwggwwwg");
    room.push("gwwwwwgwwggggggwwwwg");
    room.push("gwwwwwwwgggggwwwwwwg");
    room.push("gwwwwwwwggwwwwwwwwwg");
    room.push("gwwwwwwwwwwwwwwwwwwg");
    room.push("gwwwgwwwwwwwwwwwwwwg");
    room.push("gwwgggwwwwwwwwwwwwwg");
    room.push("gwwgggwwwwwwwwwwwwwg");
    room.push("gwgggggwwwwwwwwwwwwg");
    room.push("gggggggggggggggggggg");
}
mapInit();

/**
 * Updates the room from start to end with TileImage
 * @param {Vec2} regionStart 
 * @param {Vec2} regionEnd 
 * @param {TileSprite} tileSprite 
 */
function updateRoom(regionStart, regionEnd, tileSprite) {
    console.assert(regionStart instanceof Vec2, "regionStart Not Vec2", regionStart);
    console.assert(regionEnd instanceof Vec2, "regionEnd Not Vec2", regionEnd);
    console.log(regionStart, regionEnd);
    let [startX, startY] = regionStart.getXY();
    let [endX, endY] = regionEnd.getXY();
    //if start is after end swap
    if(startX > endX)
        [startX, endX] = [endX, startX];
    if(startY > endY)
        [startY, endY] = [endY, startY];

    //build replacement string
    let newStr = "";
    for (let i = startX; i <= endX; i++) {
        newStr += tileSprite.char;
    }
    //for each y replace section
    for(let j = startY; j <= endY; j++) {
        room[j] = room[j].slice(0, startX) + newStr + room[j].slice(endX+1);
    }
    drawMap();
}
