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

function aroundToIndex(around) {
    if(around === allRound) return 0;
    if(around === allRound ^ downAndRight) return 1;
    if(around === allRound ^ downAndLeft) return 2;
    if(around === allRound ^ upAndRight) return 3;
    if(around === allRound ^ upAndLeft) return 4;
    if(around === allRound ^ (downAndRight | downAndLeft)) return 5;
    if(around === allRound ^ (downAndRight | upAndLeft)) return 6;
    if(around === allRound ^ (downAndRight | upAndRight)) return 7;
    if(around === allRound ^ (downAndLeft | upAndLeft)) return 8;
    if(around === allRound ^ (downAndLeft | upAndRight)) return 9;
    if(around === allRound ^ (upAndLeft | upAndRight)) return 10;
    if(around === allRound ^ (downAndRight | upAndRight | downAndLeft)) return 11;
    if(around === allRound ^ (downAndRight | upAndLeft | downAndLeft)) return 12;
    if(around === allRound ^ (upAndRight | upAndLeft | downAndLeft)) return 13;
    if(around === allRound ^ (upAndRight | upAndLeft | downAndRight)) return 14;
    if(around === allRound ^ (upAndRight | upAndLeft | downAndRight | downAndLeft)) return 15;
    if(around & (left | down | up)) {
        if(~around & downAndLeft) {
            if(~around & upAndLeft) return 22;
            return 20;
        }
        if(~around & upAndLeft) return 21;
        return 16;
    }
    if(around & (left | right | up)) {
        if(~around & upAndLeft) {
            if(~around & upAndRight) return 25;
            return 23;
        }
        if(~around & upAndRight) return 24;
        return 17;
    }
    if(around & (left | up | right)) return 17;
    if(around & (down | up | right)) return 18;
    if(around & (down | left | right)) return 19;
    if(around & (down | left | right)) return 19;

}
const aroundToTileMap = {
    [allRound]: 0,
    [allRound ^ downAndRight]: 1,
    [allRound ^ downAndLeft]: 2,
    [allRound ^ upAndRight]: 3,
    [allRound ^ upAndLeft]: 4,
    [allRound ^ (downAndLeft | downAndRight)]: 5,
    [allRound ^ (upAndLeft | downAndRight)]: 6,
    [allRound ^ (upAndRight | downAndRight)]: 7,
    [allRound ^ (downAndLeft | upAndLeft)]: 8,
    [allRound ^ (downAndLeft | upAndRight)]: 9,
    [allRound ^ (upAndLeft | upAndRight)]: 10,
    [allRound ^ (downAndLeft | upAndRight | downAndRight)]: 11,
    [allRound ^ (downAndLeft | upAndLeft | downAndRight)]: 12,
    [allRound ^ (downAndLeft | upAndLeft | upAndRight)]: 13,
    [allRound ^ (downAndRight | upAndLeft | upAndRight)]: 14,
    [allRound ^ (downAndLeft | downAndRight | upAndLeft | upAndRight)]: 15,

    [allRound ^ (right | downAndRight | upAndRight)]: 16,
    [allRound ^ (right | upAndRight)]: 16,
    [allRound ^ (right | downAndRight)]: 16,
    [allRound ^ (right)]: 16,

    [allRound ^ (down | downAndLeft | downAndRight)]: 17,
    [allRound ^ (down | downAndLeft)]: 17,
    [allRound ^ (down | downAndRight)]: 17,
    [allRound ^ (down)]: 17,

    [allRound ^ (left | upAndLeft | downAndLeft)]: 18,
    [allRound ^ (left | downAndLeft)]: 18,
    [allRound ^ (left | upAndLeft)]: 18,
    [allRound ^ (left)]: 18,

    [allRound ^ (up | upAndLeft | upAndRight)]: 19,
    [allRound ^ (up | upAndRight)]: 19,
    [allRound ^ (up | upAndLeft)]: 19,
    [allRound ^ (up)]: 19,

    [allRound ^ (downAndLeft | downAndRight | right | upAndRight)]: 20,
    [allRound ^ (downAndLeft | right | upAndRight)]: 20,
    [allRound ^ (downAndLeft | downAndRight | right)]: 20,
    [allRound ^ (downAndLeft | right)]: 20,

    [allRound ^ (upAndLeft | downAndRight | right | upAndRight)]: 21,
    [allRound ^ (upAndLeft | right | upAndRight)]: 21,
    [allRound ^ (upAndLeft | downAndRight | right)]: 21,
    [allRound ^ (upAndLeft | right)]: 21,

    [allRound ^ (downAndLeft | upAndLeft | downAndRight | right | upAndRight)]: 22,
    [allRound ^ (downAndLeft | upAndLeft | downAndRight | right)]: 22,
    [allRound ^ (downAndLeft | upAndLeft | right | upAndRight)]: 22,
    [allRound ^ (downAndLeft | upAndLeft | right)]: 22,

    [allRound ^ (upAndLeft | downAndLeft | downAndRight | down)]: 23,
    [allRound ^ (upAndLeft | downAndRight | down)]: 23,
    [allRound ^ (upAndLeft | downAndLeft | down)]: 23,
    [allRound ^ (upAndLeft | down)]: 23,

    [allRound ^ (upAndRight | downAndLeft | downAndRight | down)]: 24,
    [allRound ^ (upAndRight | downAndRight | down)]: 24,
    [allRound ^ (upAndRight | downAndLeft | down)]: 24,
    [allRound ^ (upAndRight | down)]: 24,

    [allRound ^ (upAndLeft | upAndRight | downAndLeft | downAndRight | down)]: 25,
    [allRound ^ (upAndLeft | upAndRight | downAndRight | down)]: 25,
    [allRound ^ (upAndLeft | upAndRight | downAndLeft | down)]: 25,
    [allRound ^ (upAndLeft | upAndRight | down)]: 25,

    [allRound ^ (downAndRight | downAndLeft | upAndLeft | left)]: 26,
    [allRound ^ (downAndRight | upAndLeft | left)]: 26,
    [allRound ^ (downAndRight | downAndLeft | left)]: 26,
    [allRound ^ (downAndRight | left)]: 26,

    [allRound ^ (upAndRight | upAndLeft | downAndLeft | left)]: 27,
    [allRound ^ (upAndRight | downAndLeft | left)]: 27,
    [allRound ^ (upAndRight | upAndLeft | left)]: 27,
    [allRound ^ (upAndRight | left)]: 27,

    [allRound ^ (downAndRight | upAndRight | downAndLeft | upAndLeft | left)]: 28,
    [allRound ^ (downAndRight | upAndRight | upAndLeft | left)]: 28,
    [allRound ^ (downAndRight | upAndRight | downAndLeft | left)]: 28,
    [allRound ^ (downAndRight | upAndRight | left)]: 28,

    [allRound ^ (downAndLeft | upAndRight | upAndLeft | up)]: 29,
    [allRound ^ (downAndLeft | upAndLeft | up)]: 29,
    [allRound ^ (downAndLeft | upAndRight | up)]: 29,
    [allRound ^ (downAndLeft | up)]: 29,

    [allRound ^ (downAndRight | upAndRight | upAndLeft | up)]: 30,
    [allRound ^ (downAndRight | upAndLeft | up)]: 30,
    [allRound ^ (downAndRight | upAndRight | up)]: 30,
    [allRound ^ (downAndRight | up)]: 30,

    [allRound ^ (downAndRight | downAndLeft | upAndRight | upAndLeft | up)]: 31,
    [allRound ^ (downAndRight | downAndLeft | upAndLeft | up)]: 31,
    [allRound ^ (downAndRight | downAndLeft | upAndRight | up)]: 31,
    [allRound ^ (downAndRight | downAndLeft | up)]: 31,

    [up | upAndRight | upAndLeft | down | downAndRight | downAndLeft]: 32,
    [up | upAndRight | upAndLeft | down | downAndLeft]: 32,
    [up | upAndRight | upAndLeft | down | downAndRight]: 32,
    [up | upAndRight | upAndLeft | down ]: 32,
    [up | upAndLeft | down | downAndRight | downAndLeft]: 32,
    [up | upAndLeft | down | downAndRight]: 32,
    [up | upAndLeft | down | downAndLeft]: 32,
    [up | upAndLeft | down]: 32,
    [up | upAndRight | down | downAndRight | downAndLeft]: 32,
    [up | upAndRight | down | downAndRight]: 32,
    [up | upAndRight | down | downAndLeft]: 32,
    [up | upAndRight | down]: 32,
    [up | down | downAndRight | downAndLeft]: 32,
    [up | down | downAndRight]: 32,
    [up | down | downAndLeft]: 32,
    [up | down]: 32,

    [right | upAndRight | downAndRight | left | upAndLeft | downAndLeft]: 33,
    [right | upAndRight | downAndRight | left | downAndLeft]: 33,
    [right | upAndRight | downAndRight | left | upAndLeft]: 33,
    [right | upAndRight | downAndRight | left]: 33,
    [right | downAndRight | left | upAndLeft | downAndLeft]: 33,
    [right | downAndRight | left | downAndLeft]: 33,
    [right | downAndRight | left | upAndLeft]: 33,
    [right | downAndRight | left]: 33,
    [right | upAndRight | left | upAndLeft | downAndLeft]: 33,
    [right | upAndRight | left | downAndLeft]: 33,
    [right | upAndRight | left | upAndLeft]: 33,
    [right | upAndRight | left]: 33,
    [right | left | upAndLeft | downAndLeft]: 33,
    [right | left | downAndLeft]: 33,
    [right | left | upAndLeft]: 33,
    [right | left]: 33,

    [left | downAndLeft | upAndLeft | up | upAndRight | upAndLeft]: 34,
    [left | downAndLeft | upAndLeft | up | upAndRight]: 34,
    [left | downAndLeft | upAndLeft | up | upAndLeft]: 34,
    [left | downAndLeft | upAndLeft | up]: 34,
    [left | downAndLeft | up | upAndRight | upAndLeft]: 34,
    [left | downAndLeft | up | upAndRight]: 34,
    [left | downAndLeft | up | upAndLeft]: 34,
    [left | downAndLeft | up]: 34,
    [left | upAndLeft | up | upAndRight | upAndLeft]: 34,
    [left | upAndLeft | up | upAndRight]: 34,
    [left | upAndLeft | up | upAndLeft]: 34,
    [left | upAndLeft | up]: 34,
    [left | up | upAndRight | upAndLeft]: 34,
    [left | up | upAndRight]: 34,
    [left | up | upAndLeft]: 34,
    [left | up]: 34,

    [right | downAndRight | upAndRight | up | upAndRight | upAndLeft]: 35,
    [right | downAndRight | upAndRight | up | upAndRight]: 35,
    [right | downAndRight | upAndRight | up | upAndLeft]: 35,
    [right | downAndRight | upAndRight | up]: 35,
    [right | downAndRight | up | upAndRight | upAndLeft]: 35,
    [right | downAndRight | up | upAndRight]: 35,
    [right | downAndRight | up | upAndLeft]: 35,
    [right | downAndRight | up]: 35,
    [right | upAndRight | up | upAndRight | upAndLeft]: 35,
    [right | upAndRight | up | upAndRight]: 35,
    [right | upAndRight | up | upAndLeft]: 35,
    [right | upAndRight | up]: 35,
    [right | up | upAndRight | upAndLeft]: 35,
    [right | up | upAndRight]: 35,
    [right | up | upAndLeft]: 35,
    [right | up]: 35,

    [right | upAndRight | downAndRight | down | downAndRight | downAndLeft]: 36,
    [right | upAndRight | downAndRight | down | downAndRight]: 36,
    [right | upAndRight | downAndRight | down | downAndLeft]: 36,
    [right | upAndRight | downAndRight | down]: 36,
    [right | downAndRight | down | downAndRight | downAndLeft]: 36,
    [right | downAndRight | down | downAndRight]: 36,
    [right | downAndRight | down | downAndLeft]: 36,
    [right | downAndRight | down]: 36,
    [right | upAndRight | down | downAndRight | downAndLeft]: 36,
    [right | upAndRight | down | downAndRight]: 36,
    [right | upAndRight | down | downAndLeft]: 36,
    [right | upAndRight | down]: 36,
    [right | down | downAndRight | downAndLeft]: 36,
    [right | down | downAndRight]: 36,
    [right | down | downAndLeft]: 36,
    [right | down]: 36,

    [right | downAndRight | upAndRight | up | upAndRight | upAndLeft]: 37,
    [right | downAndRight | upAndRight | up | upAndRight]: 37,
    [right | downAndRight | upAndRight | up | upAndLeft]: 37,
    [right | downAndRight | upAndRight | up]: 37,
    [right | downAndRight | up | upAndRight | upAndRight]: 37,
    [right | downAndRight | up | upAndRight]: 37,
    [right | downAndRight | up | upAndLeft]: 37,
    [right | downAndRight | up]: 37,
    [right | upAndRight | up | upAndRight | upAndLeft]: 37,
    [right | upAndRight | up | upAndRight]: 37,
    [right | upAndRight | up | upAndLeft]: 37,
    [right | upAndRight | up]: 37,
    [right | up | upAndRight | upAndLeft]: 37,
    [right | up | upAndRight]: 37,
    [right | up | upAndLeft]: 37,
    [right | up]: 37,

    [allRound ^ (downAndRight | upAndRight | upAndLeft | right | up)]: 37,
    [allRound ^ (downAndRight | downAndLeft | upAndLeft | upAndRight | right | down)]: 38,
    [allRound ^ (downAndRight | downAndLeft | upAndLeft | upAndRight | left | down)]: 39,
    [allRound ^ (downAndRight | downAndLeft | upAndRight | upAndLeft | left | up)]: 40,
    [allRound ^ (downAndRight | downAndLeft | upAndRight | upAndLeft | right | up)]: 41,
    [left | upAndLeft | downAndLeft]: 42,
    [left | downAndLeft]: 42,
    [left | upAndLeft]: 42,
    [left]: 42,
    [up | upAndLeft | upAndRight]: 43,
    [up | upAndRight]: 43,
    [up | upAndLeft]: 43,
    [up]: 43,
    [right | upAndRight | downAndRight]: 44,
    [right | downAndRight]: 44,
    [right | upAndRight]: 44,
    [right]: 44,
    [down | downAndLeft | downAndRight]: 45,
    [down | downAndRight]: 45,
    [down | downAndLeft]: 45,
    [down]: 45,
    [0]: 46,
    "Not sure just a short top edge": 47,
}
Object.freeze(aroundToTileMap);
Object.freeze(dirs);
console.log(aroundToTileMap);

//Globals
let width = 0;
let height = 0;
//set up canvas
const canvas = document.getElementById("game");
const ctx = canvas.getContext('2d');
const borderSize = 40;
canvas.width = window.innerWidth - borderSize;
canvas.height = window.innerHeight - borderSize;
ctx.font = "18px arial";
ctx.lineWidth = 1;

let room = [];
let mobs = {};

let imagesToLoad = 12 + 9 + 1; //number of images in tileImages object
class TileImage {
    static width = 16;
    static height = 16;
    constructor(imgSrc) {
        //add one to imagesLoading
        this.imgSrc = imgSrc;
        this.image = new Image();
        this.image.addEventListener('load', () => {
            imagesToLoad--;
            if (imagesToLoad === 0) {
                init();
            }
            //ctx.drawImage(this.image, imagesToLoad*TileImage.tileHeight, imagesToLoad*TileImage.tileHeight);
        });
        this.image.src = imgSrc;
        this.tilesWide = this.image.width / TileImage.width;
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Vec2} location Tile x and y location
     * @param {number} around Bitmap of similar tiles that are around this
     */
    draw(ctx, location, around = null) {
        const x = location.x * TileImage.width;
        const y = location.y * TileImage.height;
        if(around !== null) {
            const sx = parseInt(aroundToTileMap[around] % this.tilesWide) * TileImage.width;
            const sy = parseInt(aroundToTileMap[around] / this.tilesWide) * TileImage.height;
            console.log("sx: ", sx, " sy: ", sy);
            ctx.drawImage(this.image, sx, sy, TileImage.width, TileImage.height, x, y, TileImage.width, TileImage.height);
            //ctx.drawImage(this.image, x, y);
        } else {
            ctx.drawImage(this.image, x, y);
        }
    }
}
const wallPath = "/img/wall/wall";
const inWallPath = "/img/inwall/inwall";
const floorPath = "/img/ground/ground";
const grassPath = "/img/tileMaps/grassTiles.png";

const grassTileMap = new TileImage(grassPath);

const tileImages = {
    "wall": {
        "BC": new TileImage(wallPath + "BC.png"),
        "BL": new TileImage(wallPath + "BL.png"),
        "BR": new TileImage(wallPath + "BR.png"),
        "C": new TileImage(wallPath + "C.png"),
        "L": new TileImage(wallPath + "L.png"),
        "R": new TileImage(wallPath + "R.png"),
        "TC": new TileImage(wallPath + "TC.png"),
        "TL": new TileImage(wallPath + "TL.png"),
        "TR": new TileImage(wallPath + "TR.png"),
        "TTC": new TileImage(wallPath + "TTC.png"),
        "TTL": new TileImage(wallPath + "TTL.png"),
        "TTR": new TileImage(wallPath + "TTR.png"),
    },
    "floor": {
        "TL": new TileImage(floorPath + "1.png"),
        "TC": new TileImage(floorPath + "2.png"),
        "TR": new TileImage(floorPath + "3.png"),
        "L": new TileImage(floorPath + "4.png"),
        "C": new TileImage(floorPath + "5.png"),
        "R": new TileImage(floorPath + "6.png"),
        "BL": new TileImage(floorPath + "7.png"),
        "BC": new TileImage(floorPath + "8.png"),
        "BR": new TileImage(floorPath + "9.png"),
    }
}

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
    draw(ctx) {
        this.tileImage.draw(ctx, this.location, this.around);
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
        console.log("Around: ", around, " Below: ", below);
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function init() {
    mapInit();
    height = room.length, width = room[0].length;
    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            if (room[j][i] === "w") {
                const around = getAround(i, j, room[j][i]);
                const tile = new Tile(new Vec2(i,j), grassTileMap, false, around);
                console.log(aroundToTileMap[around], tile);
                tile.draw(ctx);
                /*
                const around = getTileSuffixWall(i, j, room[j][i]);
                const tile = new Tile(new Vec2(i, j), tileImages.wall[around], false);
                tile.draw(ctx);
                */
            }
            else if (room[j][i] === "f") {
                const around = getTileSuffix(i, j, room[j][i]);
                const tile = new Tile(new Vec2(i, j), tileImages.floor[around], false);
                tile.draw(ctx);
            }
            await sleep(1);
            /*
            let tileClass = "";
            if(room[i][j] == "w") {
                let around = getAround(i,j);
                tileClass += " wall" + around;
            }
            //gameboard.append(`<div id="${i}-${j}" class="tile${tileClass}"></div>`);
            if(room[i][j] == "B") {
                let temp = new Mob(i,j,"blue","Pilar");
                mobs["bluePilar"] = temp;
            } else if(room[i][j] == "R") {
                mobs["redPilar"] = new Mob(i,j,"red","Pilar");
            } else if(room[i][j] == "G") {
                mobs["greenPilar"] = new Mob(i,j,"green","Pilar");
            } else if(room[i][j] == "b") {
                mobs["blueStone"] = new Mob(i,j,"blue","Stone");
            } else if(room[i][j] == "r") {
                mobs["redStone"] = new Mob(i,j,"red","Stone");
            } else if(room[i][j] == "g") {
                mobs["greenStone"] = new Mob(i,j,"green","Stone");
            } else if(room[i][j] == "C") { //implement chests later
                mobs[""] = new Mob(i,j,"chest","Closed");
            } else if(room[i][j] == "p") {
                player = new Player(i,j);
            }
            */
        }
    }
}
function mapInit() {
    //clear the room
    room = [];
    room.push("wwwwwwwwwwwwwwwwwwww");
    room.push("wwwwwwwwwwwwwwwwwwww");
    room.push("wfffffffffwwwwwffffw");
    room.push("wwfffffffffwwwfffffw");
    room.push("wwwwfwwffffwwwfffffw");
    room.push("wwwwfwwwffffwffffffw");
    room.push("wwwwwwfffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wfffwffffffffffffffw");
    room.push("wffwwwfffffffffffffw");
    room.push("wffwwwfffffffffffffw");
    room.push("wfwwwwwffffffffffffw");
    room.push("wwwwwwwwwwwwwwwwwwww");
}
