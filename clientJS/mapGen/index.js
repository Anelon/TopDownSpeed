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

const dirsToTileMap = {
    [allRound]: 0,
    [allRound ^ downAndRight]: 1,
    [allRound ^ downAndLeft]: 2,
    [allRound ^ upAndRight]: 3,
    [allRound ^ upAndRight]: 4,
    [allRound ^ (downAndLeft | downAndRight)]: 5,
    [allRound ^ (upAndLeft | downAndRight)]: 6,
    [allRound ^ (upAndRight | downAndRight)]: 7,
    [allRound ^ (downAndLeft | upAndLeft)]: 8,
    [allRound ^ (downAndLeft | upAndRight)]: 9,
    [allRound ^ (downAndLeft | upAndRight | downAndRight)]: 10,
    [allRound ^ (downAndLeft | upAndLeft | downAndRight)]: 11,
    [allRound ^ (downAndLeft | upAndLeft | upAndRight)]: 12,
    [allRound ^ (downAndRight | upAndLeft | upAndRight)]: 13,
    [allRound ^ (downAndLeft | downAndRight | upAndLeft | upAndRight)]: 14,
    [allRound ^ (downAndRight | right | upAndRight)]: 15,
    [allRound ^ (downAndRight | down | downAndLeft)]: 16,
    [allRound ^ (upAndLeft | left | downAndLeft)]: 17,
    [allRound ^ (upAndLeft | up | upAndRight)]: 18,
    [allRound ^ (downAndLeft | downAndRight | right | upAndRight)]: 19,
    [allRound ^ (upAndLeft | downAndRight | right | upAndRight)]: 20,
    [allRound ^ (downAndLeft | upAndLeft | downAndRight | right | upAndRight)]: 21,
    [allRound ^ (downAndLeft | upAndLeft | downAndRight | down)]: 22,
    [allRound ^ (downAndLeft | upAndRight | downAndRight | down)]: 23,
    [allRound ^ (downAndLeft | upAndRight | downAndRight | down | upAndLeft)]: 24,
    [allRound ^ (downAndLeft | downAndRight | left | upAndLeft)]: 25,
    [allRound ^ (downAndLeft | upAndRight | left | upAndLeft)]: 26,
    [allRound ^ (downAndLeft | downAndRight | upAndRight | left | upAndLeft)]: 27,
    [allRound ^ (downAndLeft | upAndRight | up | upAndLeft)]: 28,
    [allRound ^ (downAndRight | upAndRight | up | upAndLeft)]: 29,
    [allRound ^ (downAndRight | downAndLeft | upAndRight | up | upAndLeft)]: 30,
    [allRound ^ (downAndRight | downAndLeft | upAndRight | upAndLeft | left | right)]: 31,
    [allRound ^ (downAndRight | downAndLeft | upAndRight | upAndLeft | up | down)]: 32,
    [allRound ^ (downAndRight | downAndLeft | upAndRight | right | down)]: 33,
    [allRound ^ (downAndRight | downAndLeft | upAndLeft | left | down)]: 34,
    [allRound ^ (downAndLeft | upAndRight | upAndLeft | left | up)]: 35,
    [allRound ^ (downAndRight | upAndRight | upAndLeft | right | up)]: 36,
    [allRound ^ (downAndRight | downAndLeft | upAndLeft | upAndRight | right | down)]: 37,
    [allRound ^ (downAndRight | downAndLeft | upAndLeft | upAndRight | left | down)]: 38,
    [allRound ^ (downAndRight | downAndLeft | upAndRight | upAndLeft | left | up)]: 39,
    [allRound ^ (downAndRight | downAndLeft | upAndRight | upAndLeft | right | up)]: 40,
    [left | upAndLeft | downAndLeft]: 41,
    [up | upAndLeft | upAndRight]: 42,
    [right | upAndRight | downAndRight]: 43,
    [down | downAndLeft | downAndRight]: 44,
    "Not sure just a short top edge": 45,
}
Object.freeze(dirsToTileMap);
Object.freeze(dirs);
console.log(dirsToTileMap);

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

let imagesToLoad = 12 + 9; //number of images in tileImages object
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
    }
    draw(ctx, location) {
        const x = location.x * TileImage.width;
        const y = location.y * TileImage.height;
        ctx.drawImage(this.image, x, y);
    }
}
const wallPath = "/img/wall/wall";
const inWallPath = "/img/inwall/inwall";
const floorPath = "/img/ground/ground";

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
    "insideWall": {
        "BC": new TileImage(inWallPath + "BC.png"),
        "BL": new TileImage(inWallPath + "BL.png"),
        "BR": new TileImage(inWallPath + "BR.png"),
        "C": new TileImage(inWallPath + "C.png"),
        "L": new TileImage(inWallPath + "L.png"),
        "R": new TileImage(inWallPath + "R.png"),
        "TC": new TileImage(inWallPath + "TC.png"),
        "TL": new TileImage(inWallPath + "TL.png"),
        "TR": new TileImage(inWallPath + "TR.png"),
        "TTC": new TileImage(inWallPath + "TTC.png"),
        "TTL": new TileImage(inWallPath + "TTL.png"),
        "TTR": new TileImage(inWallPath + "TTR.png"),
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
    constructor(location, tileImage, isWalkable) {
        console.assert((location instanceof Vec2), "Location not a Vec2", location);
        console.assert((tileImage instanceof TileImage), "tileImage not a TileImage", tileImage);
        console.assert((typeof (isWalkable) === 'boolean'), "tileImage not a TileImage", tileImage);

        //location
        this.location = location;
        //image
        this.tileImage = tileImage;
        //walkable
        this.isWalkable = isWalkable;
    }
    draw(ctx) {
        this.tileImage.draw(ctx, this.location);
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
                const around = getTileSuffixWall(i, j, room[j][i]);
                const tile = new Tile(new Vec2(i, j), tileImages.wall[around], false);
                tile.draw(ctx);
            }
            else if (room[j][i] === "f") {
                const around = getTileSuffix(i, j, room[j][i]);
                console.log(around);
                const tile = new Tile(new Vec2(i, j), tileImages.floor[around], false);
                tile.draw(ctx);
            }
            await sleep(10);
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
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wffffffffffffffffffw");
    room.push("wwwwwwwwwwwwwwwwwwww");
}
