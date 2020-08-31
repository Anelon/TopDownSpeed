import Vec2 from "../../sharedJS/vec2.js";
import CanvasWrapper from "../canvasWrapper.js";

//consts
const right = 1;
const left = 2;
const up = 4;
const down = 8;
const downAndRight = 16;
const downAndLeft = 32;
const upAndRight = 64;
const upAndLeft = 128;
const downRight = down | right | downAndRight;
const downLeft = down | left | downAndLeft;
const upRight = up | right | upAndRight;
const upLeft = up | left | upAndLeft;
const upRightDown = up | right | down | upAndRight | downAndRight;
const upLeftDown = up | left | down | upAndLeft | downAndLeft;
const rightUpLeft = right | up | left | upAndRight | upAndLeft;
const rightDownLeft = right | down | left | downAndLeft | downAndRight;
const allRound = up | down | left | right | downAndLeft | downAndRight | upAndRight | upAndLeft;

const dirs = [[1, 0, right], [-1, 0, left], [0, -1, up], [0, 1, down], [1, 1, downAndRight], [-1, 1, downAndLeft], [1, -1, upAndRight], [-1, -1, upAndLeft]];

const aroundToTileMap = new Map([
    [allRound, 0],
    [allRound ^ downAndRight, 1],
    [allRound ^ downAndLeft, 2],
    [allRound ^ upAndRight, 3],
    [allRound ^ upAndLeft, 4],
    [allRound ^ (downAndLeft | downAndRight), 5],
    [allRound ^ (upAndLeft | downAndRight), 6],
    [allRound ^ (upAndRight | downAndRight), 7],
    [allRound ^ (downAndLeft | upAndLeft), 8],
    [allRound ^ (downAndLeft | upAndRight), 9],
    [allRound ^ (upAndLeft | upAndRight), 10],
    [allRound ^ (downAndLeft | upAndRight | downAndRight), 11],
    [allRound ^ (downAndLeft | upAndLeft | downAndRight), 12],
    [allRound ^ (downAndLeft | upAndLeft | upAndRight), 13],
    [allRound ^ (downAndRight | upAndLeft | upAndRight), 14],
    [allRound ^ (downAndLeft | downAndRight | upAndLeft | upAndRight), 15],

    [allRound ^ (right | downAndRight | upAndRight), 16],
    [allRound ^ (right | upAndRight), 16],
    [allRound ^ (right | downAndRight), 16],
    [allRound ^ (right), 16],

    [allRound ^ (down | downAndLeft | downAndRight), 17],
    [allRound ^ (down | downAndLeft), 17],
    [allRound ^ (down | downAndRight), 17],
    [allRound ^ (down), 17],

    [allRound ^ (left | upAndLeft | downAndLeft), 18],
    [allRound ^ (left | downAndLeft), 18],
    [allRound ^ (left | upAndLeft), 18],
    [allRound ^ (left), 18],

    [allRound ^ (up | upAndLeft | upAndRight), 19],
    [allRound ^ (up | upAndRight), 19],
    [allRound ^ (up | upAndLeft), 19],
    [allRound ^ (up), 19],

    [allRound ^ (downAndLeft | downAndRight | right | upAndRight), 20],
    [allRound ^ (downAndLeft | right | upAndRight), 20],
    [allRound ^ (downAndLeft | downAndRight | right), 20],
    [allRound ^ (downAndLeft | right), 20],

    [allRound ^ (upAndLeft | downAndRight | right | upAndRight), 21],
    [allRound ^ (upAndLeft | right | upAndRight), 21],
    [allRound ^ (upAndLeft | downAndRight | right), 21],
    [allRound ^ (upAndLeft | right), 21],

    [allRound ^ (downAndLeft | upAndLeft | downAndRight | right | upAndRight), 22],
    [allRound ^ (downAndLeft | upAndLeft | downAndRight | right), 22],
    [allRound ^ (downAndLeft | upAndLeft | right | upAndRight), 22],
    [allRound ^ (downAndLeft | upAndLeft | right), 22],

    [allRound ^ (upAndLeft | downAndLeft | downAndRight | down), 23],
    [allRound ^ (upAndLeft | downAndRight | down), 23],
    [allRound ^ (upAndLeft | downAndLeft | down), 23],
    [allRound ^ (upAndLeft | down), 23],

    [allRound ^ (upAndRight | downAndLeft | downAndRight | down), 24],
    [allRound ^ (upAndRight | downAndRight | down), 24],
    [allRound ^ (upAndRight | downAndLeft | down), 24],
    [allRound ^ (upAndRight | down), 24],

    [allRound ^ (upAndLeft | upAndRight | downAndLeft | downAndRight | down), 25],
    [allRound ^ (upAndLeft | upAndRight | downAndRight | down), 25],
    [allRound ^ (upAndLeft | upAndRight | downAndLeft | down), 25],
    [allRound ^ (upAndLeft | upAndRight | down), 25],

    [allRound ^ (downAndRight | downAndLeft | upAndLeft | left), 26],
    [allRound ^ (downAndRight | upAndLeft | left), 26],
    [allRound ^ (downAndRight | downAndLeft | left), 26],
    [allRound ^ (downAndRight | left), 26],

    [allRound ^ (upAndRight | upAndLeft | downAndLeft | left), 27],
    [allRound ^ (upAndRight | downAndLeft | left), 27],
    [allRound ^ (upAndRight | upAndLeft | left), 27],
    [allRound ^ (upAndRight | left), 27],

    [allRound ^ (downAndRight | upAndRight | downAndLeft | upAndLeft | left), 28],
    [allRound ^ (downAndRight | upAndRight | upAndLeft | left), 28],
    [allRound ^ (downAndRight | upAndRight | downAndLeft | left), 28],
    [allRound ^ (downAndRight | upAndRight | left), 28],

    [allRound ^ (downAndLeft | upAndRight | upAndLeft | up), 29],
    [allRound ^ (downAndLeft | upAndLeft | up), 29],
    [allRound ^ (downAndLeft | upAndRight | up), 29],
    [allRound ^ (downAndLeft | up), 29],

    [allRound ^ (downAndRight | upAndRight | upAndLeft | up), 30],
    [allRound ^ (downAndRight | upAndLeft | up), 30],
    [allRound ^ (downAndRight | upAndRight | up), 30],
    [allRound ^ (downAndRight | up), 30],

    [allRound ^ (downAndRight | downAndLeft | upAndRight | upAndLeft | up), 31],
    [allRound ^ (downAndRight | downAndLeft | upAndLeft | up), 31],
    [allRound ^ (downAndRight | downAndLeft | upAndRight | up), 31],
    [allRound ^ (downAndRight | downAndLeft | up), 31],

    [up | upAndRight | upAndLeft | down | downAndRight | downAndLeft, 32],
    [up | upAndRight | upAndLeft | down | downAndLeft, 32],
    [up | upAndRight | upAndLeft | down | downAndRight, 32],
    [up | upAndRight | upAndLeft | down , 32],
    [up | upAndLeft | down | downAndRight | downAndLeft, 32],
    [up | upAndLeft | down | downAndRight, 32],
    [up | upAndLeft | down | downAndLeft, 32],
    [up | upAndLeft | down, 32],
    [up | upAndRight | down | downAndRight | downAndLeft, 32],
    [up | upAndRight | down | downAndRight, 32],
    [up | upAndRight | down | downAndLeft, 32],
    [up | upAndRight | down, 32],
    [up | down | downAndRight | downAndLeft, 32],
    [up | down | downAndRight, 32],
    [up | down | downAndLeft, 32],
    [up | down, 32],

    [right | upAndRight | downAndRight | left | upAndLeft | downAndLeft, 33],
    [right | upAndRight | downAndRight | left | downAndLeft, 33],
    [right | upAndRight | downAndRight | left | upAndLeft, 33],
    [right | upAndRight | downAndRight | left, 33],
    [right | downAndRight | left | upAndLeft | downAndLeft, 33],
    [right | downAndRight | left | downAndLeft, 33],
    [right | downAndRight | left | upAndLeft, 33],
    [right | downAndRight | left, 33],
    [right | upAndRight | left | upAndLeft | downAndLeft, 33],
    [right | upAndRight | left | downAndLeft, 33],
    [right | upAndRight | left | upAndLeft, 33],
    [right | upAndRight | left, 33],
    [right | left | upAndLeft | downAndLeft, 33],
    [right | left | downAndLeft, 33],
    [right | left | upAndLeft, 33],
    [right | left, 33],

    [left | downAndLeft | upAndLeft | up | upAndRight | upAndLeft, 34],
    [left | downAndLeft | upAndLeft | up | upAndRight, 34],
    [left | downAndLeft | upAndLeft | up | upAndLeft, 34],
    [left | downAndLeft | upAndLeft | up, 34],
    [left | downAndLeft | up | upAndRight | upAndLeft, 34],
    [left | downAndLeft | up | upAndLeft, 34],
    [left | upAndLeft | up | upAndRight | upAndLeft, 34],
    [left | upAndLeft | up | upAndRight, 34],
    [left | upAndLeft | up | upAndLeft, 34],
    [left | upAndLeft | up, 34],
    [left | up | upAndRight | upAndLeft, 34],
    [left | up | upAndLeft, 34],

    [left | downAndLeft | up | upAndRight, 38],
    [left | downAndLeft | up, 38],
    [left | up | upAndRight, 38],
    [left | up, 38],

    [right | downAndRight | upAndRight | up | upAndRight | upAndLeft, 35],
    [right | downAndRight | upAndRight | up | upAndRight, 35],
    [right | downAndRight | upAndRight | up | upAndLeft, 35],
    [right | downAndRight | upAndRight | up, 35],
    [right | downAndRight | up | upAndRight | upAndLeft, 35],
    [right | downAndRight | up | upAndRight, 35],
    [right | upAndRight | up | upAndRight | upAndLeft, 35],
    [right | upAndRight | up | upAndRight, 35],
    [right | upAndRight | up | upAndLeft, 35],
    [right | upAndRight | up, 35],
    [right | up | upAndRight | upAndLeft, 35],
    [right | up | upAndRight, 35],

    [right | downAndRight | up | upAndLeft, 39],
    [right | downAndRight | up, 39],
    [right | up | upAndLeft, 39],
    [right | up, 39],

    [right | upAndRight | downAndRight | down | downAndRight | downAndLeft, 36],
    [right | upAndRight | downAndRight | down | downAndRight, 36],
    [right | upAndRight | downAndRight | down | downAndLeft, 36],
    [right | upAndRight | downAndRight | down, 36],
    [right | downAndRight | down | downAndRight | downAndLeft, 36],
    [right | downAndRight | down | downAndRight, 36],
    [right | downAndRight | down | downAndLeft, 36],
    [right | downAndRight | down, 36],
    [right | upAndRight | down | downAndRight | downAndLeft, 36],
    [right | upAndRight | down | downAndRight, 36],
    [right | down | downAndRight | downAndLeft, 36],
    [right | down | downAndRight, 36],

    [right | upAndRight | down | downAndLeft, 40],
    [right | upAndRight | down, 40],
    [right | down | downAndLeft, 40],
    [right | down, 40],

    [left | downAndLeft | upAndLeft | down | downAndRight | downAndLeft, 37],
    [left | downAndLeft | upAndLeft | down | downAndRight, 37],
    [left | downAndLeft | upAndLeft | down | downAndLeft, 37],
    [left | downAndLeft | upAndLeft | down, 37],
    [left | downAndLeft | down | downAndRight | downAndLeft, 37],
    [left | downAndLeft | down | downAndRight, 37],
    [left | downAndLeft | down | downAndLeft, 37],
    [left | downAndLeft | down, 37],
    [left | upAndLeft | down | downAndRight | downAndLeft, 37],
    [left | upAndLeft | down | downAndLeft, 37],
    [left | down | downAndRight | downAndLeft, 37],
    [left | down | downAndLeft, 37],

    [left | upAndLeft | down | downAndRight, 41],
    [left | down | downAndRight, 41],
    [left | upAndLeft | down, 41],
    [left | down, 41],

    [left | upAndLeft | downAndLeft, 42],
    [left | downAndLeft, 42],
    [left | upAndLeft, 42],
    [left, 42],

    [up | upAndLeft | upAndRight, 43],
    [up | upAndRight, 43],
    [up | upAndLeft, 43],
    [up, 43],

    [right | upAndRight | downAndRight, 44],
    [right | downAndRight, 44],
    [right | upAndRight, 44],
    [right, 44],

    [down | downAndLeft | downAndRight, 45],
    [down | downAndRight, 45],
    [down | downAndLeft, 45],
    [down, 45],

    [0, 46],
    ["Not sure just a short top edge", 47],
]);
Object.freeze(aroundToTileMap);
Object.freeze(dirs);
//console.log(aroundToTileMap);

//Globals
let width = 0;
let height = 0;
//set up canvas
const canvas = new CanvasWrapper();
let bounds = canvas.getBoundingClientRect();

let regionStart = new Vec2();
let regionEnd = new Vec2();
canvas.addEventListener("mousedown", function(e) {
    console.log(e);
    const clickLocation = new Vec2(e.offsetX, e.offsetY);
    regionStart = clickLocation.multiplyScalar(1 / TileImage.width).floorS();
    console.log(clickLocation.log(), regionStart.log());
});
canvas.addEventListener("mouseup", function(e) {
    console.log(e);
    const clickLocation = new Vec2(e.offsetX, e.offsetY);
    regionEnd = clickLocation.multiplyScalar(1 / TileImage.width).floorS();
    console.log(clickLocation.log(), regionEnd.log());
    updateRoom(regionStart, regionEnd, grassTileMap);
});

/*
const canvas = document.getElementById("game");
const ctx = canvas.getContext('2d');
const borderSize = 40;
canvas.width = window.innerWidth - borderSize;
canvas.height = window.innerHeight - borderSize;
ctx.font = "18px arial";
ctx.lineWidth = 1;
*/

let room = new Array();
let mobs = new Map();

let imagesToLoad = 0; //number of images in tileImages object
class TileImage {
    static width = 16;
    static height = 16;
    constructor(imgSrc, char) {
        //add one to imagesLoading
        imagesToLoad++;
        this.imgSrc = imgSrc;
        this.image = new Image();
        this.image.addEventListener('load', () => {
            this.tilesWide = this.image.width / TileImage.width;
            imagesToLoad--;
            if (imagesToLoad === 0) {
                drawMap();
            }
        });
        this.image.src = imgSrc;
        this.char = char;
    }
    /**
     * 
     * @param {CanvasWrapper} ctx 
     * @param {Vec2} location Tile x and y location
     * @param {number} around Bitmap of similar tiles that are around this
     */
    draw(canvas, location, around = null) {
        const x = location.x * TileImage.width;
        const y = location.y * TileImage.height;
        if(around !== null) {
            let sx = 0, sy = 0;
            //if it doesn't contain around I probably did something wrong but default to the first tile in the map
            if(aroundToTileMap.has(around)) {
                sx = parseInt(aroundToTileMap.get(around) % this.tilesWide) * TileImage.width;
                sy = parseInt(aroundToTileMap.get(around) / this.tilesWide) * TileImage.height;
            } else console.log(location.log(), "tile not found ", around.toString(2));
            //console.log("sx: ", sx, " sy: ", sy);
            canvas.drawImage(this.image, x, y, sx, sy, TileImage.width, TileImage.height);
            //ctx.drawImage(this.image, x, y);
        } else {
            ctx.drawImage(this.image, x, y);
        }
    }
}
const tileMapPath = "/img/tileMaps/";
const grassTileMap = new TileImage(tileMapPath + "grasstiles.png", "g");
const snowTileMap = new TileImage(tileMapPath + "snowTiles.png", "s");
const dirtTileMap = new TileImage(tileMapPath + "dirtPathTiles.png", "d");
const waterTileMap = new TileImage(tileMapPath + "waterTiles.png", "w");

const tileImages = new Array();
tileImages.push(grassTileMap);
tileImages.push(snowTileMap);
tileImages.push(dirtTileMap);
tileImages.push(waterTileMap);



class Tile {
    /**
     * Constructor
     * @param {Vec2} location 
     * @param {TileImage} tileImage 
     * @param {boolean} isWalkable 
     */
    constructor(location, tileImage, isWalkable, around) {
        console.assert((location instanceof Vec2), "Location not a Vec2", location);
        console.assert((tileImage instanceof TileImage), "tileImage not a TileImage", tileImage);
        console.assert((typeof (isWalkable) === 'boolean'), "tileImage not a TileImage", tileImage);

        //location
        this.location = location;
        //image
        this.tileImage = tileImage;
        //walkable
        this.isWalkable = isWalkable;
        this.around = around;
    }
    draw(canvas) {
        this.tileImage.draw(canvas, this.location, this.around);
    }
}

/**
 * Gets where each tile is around the current tile
 * @param {number} i X location of Tile
 * @param {number} j Y location of Tile
 */
function getAround(i, j, curr) {
    //console.log("getting Around");
    let around = 0;
    for (const dir of dirs) {
        //console.log(dirs[dir]);
        let newI = dir[0] + i;
        let newJ = dir[1] + j;
        //if out of bounds count that as the tile
        if (newI < 0 || newJ < 0 || newI >= width || newJ >= height) {
            around = around | dir[2];
            continue;
        }
        if (curr == room[newJ][newI]) {
            around = around | dir[2];
        }
    }
    return around;
}
function getTileSuffixWall(i, j, curr) {
    const around = getAround(i, j, curr);
    //see if statements in getImg from mapGen.py
    //if self.desc == "fence":
    //convert to check if it is the wall tile (or something)
    if (around === allRound) {
        const below = getAround(i, j + 1, curr);
        //console.log("Around: ", around, " Below: ", below);
        if (!(below & down)) return "TTC";
        //should be above a tile that is TL
        if (!(below & downAndRight)) return "TTL";
        //should be above a tile that is TR
        if (!(below & downAndLeft)) return "TTR";
    }
    if (around & up) {
        if (around & right) {
            if (around & down) {
                if (around & left) {
                    if (!(around & upAndRight))
                        return "BL";
                    if (!(around & upAndLeft))
                        return "BR";
                    if (!(around & downAndRight))
                        return "TL";
                    if (!(around & downAndLeft))
                        return "TR";
                }
                return "R";
            }
            if (around & left)
                return "TC";
            return "IBR";//no idea what these are
        }
        if (around & left) {
            if (around & down)
                return "L";
            return "IBL";//no idea what these are
        }
    }
    if (around & down) {
        if (around & right) {
            if (around & left) {
                return "BC";
            }
            return "ITR";//no idea what these are (probably inner top left)
        }
        if (around & left) {
            return "ITL";
        }
    }
    return "C";
}
//works with split tiles where it just has 9 different directions
function getTileSuffix(i, j, curr) {
    const around = getAround(i, j, curr);
    //see if statements in getImg from mapGen.py
    //if self.desc == "fence":
    //convert to check if it is the wall tile (or something)
    if(around === allRound) return "C";
    if(around === upRight) return "BL";
    if(around === upLeft) return "BR";
    if(around === downRight) return "TL";
    if(around === downLeft) return "TR";
    if(around === upRightDown) return "L";
    if(around === upLeftDown) return "R";
    if(around === rightDownLeft) return "TC";
    if(around === rightUpLeft) return "BC";
    return "C";
}

function setTile(tileCoord, tileImage) {
    room[tileCoord.y][tileCoord.x] = "g";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function drawMap() {
    canvas.clear();
    height = room.length, width = room[0].length;
    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            const curr = room[j][i];
            for(const tileImage of tileImages) {
                if (curr === tileImage.char) {
                    const around = getAround(i, j, curr);
                    const tile = new Tile(new Vec2(i, j), tileImage, false, around);
                    tile.draw(canvas);
                }
            }
            //await sleep(.01);
        }
    }
    canvas.drawGrid();
}

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
 * @param {TileImage} tileImage 
 */
function updateRoom(regionStart, regionEnd, tileImage) {
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
        newStr += tileImage.char;
    }
    for(let j = startY; j <= endY; j++) {
        console.log("Room ", room[j]);
        //room[j] = room[j].replace(room[j].slice(startX, endX+1), newStr);
        room[j] = room[j].slice(0, startX) + newStr + room[j].slice(endX+1);
        console.log("Room ", room[j]);
    }
    console.log(room);
    drawMap();
}
