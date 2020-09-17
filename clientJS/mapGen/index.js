import Vec2 from "../../sharedJS/vec2.js";
import CanvasWrapper from "../canvasWrapper.js";
import TileSprite from "../tileSprite.js";
import { DIRS, DIRBITS } from "../../sharedJS/utils/dirsMap.js";
import { tileSprites } from "../sprites.js";
import GameMap from "../../sharedJS/map/gameMap.js"
import { TILES, TILE_NAMES } from "../../sharedJS/utils/enums.js";

//Globals
const numLayers = 4;
const gameMap = new GameMap(4, new Vec2(15, 200));
const tileSize = new Vec2(32,32);
let selectedLayer = 1;
let selectedTileName = TILE_NAMES.g;
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
    regionEnd = clickLocation.multiplyVec(canvas.tileSize.invert()).floorS();
    //console.log(clickLocation.log(), regionEnd.log());
    gameMap.update(regionStart, regionEnd, selectedLayer, TILES[selectedTileName]);
    //redraw canvas
    gameMap.draw(canvas);
});

const tileSelectList = document.querySelector("ul.tileSelectList");
for(const tileName of Object.values(TILE_NAMES)) {
    console.log(tileName);
    if(!TILES[tileName]) continue;
    const tileSelect = document.createElement("li");
    tileSelect.innerText = tileName;
    tileSelectList.appendChild(tileSelect);
}
tileSelectList.addEventListener("click", function(e) {
    console.log(e, e.target);
    const tileName = /** @type HTMLElement */(e.target).innerText;
    selectedTileName = tileName;
});

const layerSelectList = document.querySelector("ul.layerSelectList");
for(let i = 0; i < numLayers; i++) {
    const layerSelect = document.createElement("li");
    layerSelect.innerText = "Layer: " + i;
    layerSelectList.appendChild(layerSelect);
}
layerSelectList.addEventListener("click", function(e) {
    console.log(e, e.target);
    const layerSelect = /** @type HTMLElement */(e.target).innerText;
    selectedLayer = parseInt(layerSelect.split(" ")[1]);
    console.log(selectedLayer);
});



gameMap.draw(canvas);