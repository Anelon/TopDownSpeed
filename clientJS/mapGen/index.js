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

function aroundToString(around) {
    let retStr = "";
    if(around & right) retStr += "right | ";
    if(around & left) retStr += "left | ";
    if(around & up) retStr += "up | ";
    if(around & down) retStr += "down | ";
    if(around & downAndRight) retStr += "downAndRight | ";
    if(around & downAndLeft) retStr += "downAndLeft | ";
    if(around & upAndRight) retStr += "upAndRight | ";
    if(around & upAndLeft) retStr += "upAndLeft | ";
    return retStr;
}

const dirs = [[1, 0, right], [-1, 0, left], [0, -1, up], [0, 1, down], [1, 1, downAndRight], [-1, 1, downAndLeft], [1, -1, upAndRight], [-1, -1, upAndLeft]];
Object.freeze(dirs);

//Globals
let width = 0;
let height = 0;
//set up canvas
const canvas = new CanvasWrapper();
let bounds = canvas.getBoundingClientRect();

let regionStart = new Vec2();
let regionEnd = new Vec2();
canvas.addEventListener("mousedown", function(e) {
    //console.log(e);
    const clickLocation = new Vec2(e.offsetX, e.offsetY);
    regionStart = clickLocation.multiplyScalar(1 / TileImage.width).floorS();
    //console.log(clickLocation.log(), regionStart.log());
});
canvas.addEventListener("mouseup", function(e) {
    //console.log(e);
    const clickLocation = new Vec2(e.offsetX, e.offsetY);
    regionEnd = clickLocation.multiplyScalar(1 / TileImage.width).floorS();
    //console.log(clickLocation.log(), regionEnd.log());
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
    constructor(imgSrc, char, connects = [char]) {
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
        this.connects = connects;
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
            let index = aroundToIndex(around);
            if (index !== -1) {
                sx = parseInt(index % this.tilesWide) * TileImage.width;
                sy = parseInt(index / this.tilesWide) * TileImage.height;
            } else {
                console.log(location.log(), "tile not found ", around.toString(2));
                let aroundStr = aroundToString(around);
                console.log(aroundStr);
            }
            //console.log("sx: ", sx, " sy: ", sy);
            canvas.drawImage(this.image, x, y, sx, sy, TileImage.width, TileImage.height);
            //ctx.drawImage(this.image, x, y);
        } else {
            ctx.drawImage(this.image, x, y);
        }
    }
}
const tileMapPath = "/img/tileMaps/";
const grassTileMap = new TileImage(tileMapPath + "grasstiles.png", "g", ["g","d"]);
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
 * @param {Array} curr Array of tiles that can connect to
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
        if (curr.includes(room[newJ][newI])) {
            around = around | dir[2];
        }
    }
    return around;
}
function aroundToIndex(around) {
    //console.log(around.toString(2), ((~around >>> 0)).toString(2));
    //console.log(~around === (~around >>> 0)); //stupid!!!
    //need unsigned bitwise not of around
    let nAround = (~around >>> 0);
    if(around === allRound) return 0;
    if(around === (allRound ^ downAndRight)) return 1;
    if(around === (allRound ^ downAndLeft)) return 2;
    if(around === (allRound ^ upAndRight)) return 3;
    if(around === (allRound ^ upAndLeft)) return 4;
    if(around === (allRound ^ (downAndLeft | downAndRight))) return 5;
    if(around === (allRound ^ (upAndLeft | downAndRight))) return 6;
    if(around === (allRound ^ (upAndRight | downAndRight))) return 7;
    if(around === (allRound ^ (downAndLeft | upAndLeft))) return 8;
    if(around === (allRound ^ (downAndLeft | upAndRight))) return 9;
    if(around === (allRound ^ (upAndLeft | upAndRight))) return 10;
    if(around === (allRound ^ (downAndLeft | upAndRight | downAndRight))) return 11;
    if(around === (allRound ^ (downAndLeft | upAndLeft | downAndRight))) return 12;
    if(around === (allRound ^ (downAndLeft | upAndLeft | upAndRight))) return 13;
    if(around === (allRound ^ (downAndRight | upAndLeft | upAndRight))) return 14;
    if(around === (allRound ^ (downAndLeft | downAndRight | upAndLeft | upAndRight))) return 15;
    //edges
    if(nAround & up) {
        if (nAround & down) {
            if (nAround & left) {
                if (nAround & right) return 46;
                return 44;
            }
            if(nAround & right) return 42;
            return 33;
        }
        if(nAround & right) {
            if(nAround & left) return 45;
            if(nAround & downAndLeft) return 41;
            return 37;
        }
        if(nAround & left) {
            if(nAround & downAndRight) return 40;
            return 36;
        }
        if(nAround & downAndRight && nAround & downAndLeft) return 31;
        if(nAround & downAndRight) return 30;
        if(nAround & downAndLeft) return 29;
        return 19;
    }
    if(nAround & down) {
        if(nAround & right) {
            if(nAround & left) return 43;
            if(nAround & upAndLeft) return 38;
            return 34;
        }
        if(nAround & left) {
            if(nAround & upAndRight) return 39;
            return 35;
        }
        if(nAround & upAndRight && nAround & upAndLeft) return 25;
        if(nAround & upAndRight) return 24;
        if(nAround & upAndLeft) return 23;
        return 17;
    }
    if(nAround & left) {
        if (nAround & right) return 32;
        if(nAround & upAndRight && nAround & downAndRight) return 28;
        if(nAround & downAndRight) return 26;
        if(nAround & upAndRight) return 27;
        return 18;
    }
    if(nAround & right) {
        if(nAround & downAndLeft && nAround & upAndLeft) return 22;
        if(nAround & downAndLeft) return 20;
        if(nAround & upAndLeft) return 21;
        return 16;
    }
    //default case if something doesn't get found (should never get here)
	return -1;
}
function getTileSuffixWall(i, j, curr) {
    const around = getAround(i, j, curr);
    //see if statements in getImg from mapGen.py
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
                    const around = getAround(i, j, tileImage.connects);
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
        room[j] = room[j].slice(0, startX) + newStr + room[j].slice(endX+1);
    }
    drawMap();
}
