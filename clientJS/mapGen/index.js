import Vec2 from "../../sharedJS/vec2.js";
import CanvasWrapper from "../canvasWrapper.js";
import GameMap from "../../sharedJS/map/gameMap.js"
import { TILES, TILE_NAMES, REGIONS } from "../../sharedJS/utils/enums.js";
import PlayerController from "../playerController.js";
import Time from "../../sharedJS/utils/time.js";
import CollisionEngine from "../../sharedJS/collisionEngine.js";
import ClientLoop from "../clientLoop.js";

//Globals
const voidWidth = 5;
const tileSize = new Vec2(32,32);
const gameMap = new GameMap(voidWidth, new Vec2(15, 50), tileSize.clone());
const pixelDims = gameMap.dimentions.multiplyVec(tileSize);
const collisionEngine = new CollisionEngine(pixelDims.x, pixelDims.y);
collisionEngine.setRegions(gameMap.generateRegions());
// @ts-ignore
const time = new Time(performance);

const EDIT_MODES = {
    tile: "tile",
    region: "region",
}

//Selections
let editMode = EDIT_MODES.tile;
let selectedLayer = 1;
let selectedTileName = TILE_NAMES.g;
let selectedRegion = Object.keys(REGIONS)[0];

//set up canvas
const canvas = new CanvasWrapper({tileSize, canvasSize: gameMap.dimentions.clone().multiplyVecS(tileSize)});
const you = new PlayerController(new Vec2(100, 100), "Player","./img/player.png", 500, 200, 2, canvas);
you.silenced = true;
canvas.setCenter(you.location);
you.draw(canvas);

//--- Initialize the client loop ---//
new ClientLoop(you, gameMap, canvas, time, collisionEngine);

//reagions for selections
let regionStart = new Vec2();
let regionEnd = new Vec2();
canvas.addEventListener("mousedown", function(e) {
    //console.log(e);
    const clickLocation = new Vec2(e.offsetX, e.offsetY);
    regionStart = clickLocation.addS(canvas.topRight).multiplyVec(canvas.tileSize.invert()).floorS();
    //console.log(clickLocation.log(), regionStart.log());
});
canvas.addEventListener("mouseup", function(e) {
    //console.log(e);
    const clickLocation = new Vec2(e.offsetX, e.offsetY);
    regionEnd = clickLocation.addS(canvas.topRight).multiplyVec(canvas.tileSize.invert()).floorS();
    //console.log(clickLocation.log(), regionEnd.log());
    if(editMode === EDIT_MODES.tile) {
        gameMap.update(regionStart, regionEnd, selectedLayer, TILES[selectedTileName]);
    } else if (editMode === EDIT_MODES.region) {
        gameMap.addRegion(regionStart, regionEnd, REGIONS[selectedRegion], selectedRegion);
        collisionEngine.setRegions(gameMap.generateRegions());
    }
});

//--- set up tile selection ---//
const tileSelectList = document.querySelector("#tileSelectList");
for(const tileName of Object.values(TILE_NAMES)) {
    console.log(tileName);
    if(!TILES[tileName]) continue;
    const tileSelect = document.createElement("li");
    tileSelect.innerText = tileName;
    tileSelect.setAttribute("id", tileName);
    tileSelectList.appendChild(tileSelect);
}

//--- set up layer selection ---//
const layerSelectList = document.querySelector("#layerSelectList");
for(let i = 0; i < GameMap.numLayers; i++) {
    const layerSelect = document.createElement("li");
    layerSelect.innerText = "Layer " + i;
    layerSelect.setAttribute("id", "Layer" + i);
    layerSelectList.appendChild(layerSelect);
}

//--- set up layer selection ---//
const regionSelectList = document.querySelector("#regionSelectList");
for(const regionName of Object.keys(REGIONS)) {
    const regionSelect = document.createElement("li");
    regionSelect.innerText = regionName;
    regionSelect.setAttribute("id", regionName);
    regionSelectList.appendChild(regionSelect);
}

//--- set up event listeners ---//
tileSelectList.addEventListener("click", function(e) {
    const tileName = /** @type HTMLElement */(e.target).innerText;
    document.querySelector(`#${selectedTileName}`).classList.remove("active");
    selectedTileName = tileName;
    document.querySelector(`#${selectedTileName}`).classList.add("active");
    //switch edit mode
    if(editMode !== EDIT_MODES.tile) {
        document.querySelector(`#${selectedRegion}`).classList.remove("active");
        editMode = EDIT_MODES.tile;
    }
});
layerSelectList.addEventListener("click", function(e) {
    const layerSelect = /** @type HTMLElement */(e.target).innerText;
    document.querySelector(`#Layer${selectedLayer}`).classList.remove("active");
    selectedLayer = parseInt(layerSelect.split(" ")[1]);
    document.querySelector(`#Layer${selectedLayer}`).classList.add("active");
    //switch edit mode
    if(editMode !== EDIT_MODES.tile) {
        document.querySelector(`#${selectedRegion}`).classList.remove("active");
        editMode = EDIT_MODES.tile;
    }
});
regionSelectList.addEventListener("click", function(e) {
    const regionSelect = /** @type HTMLElement */(e.target).innerText;
    document.querySelector(`#${selectedRegion}`).classList.remove("active");
    selectedRegion = regionSelect;
    document.querySelector(`#${selectedRegion}`).classList.add("active");
    //switch edit mode
    if(editMode !== EDIT_MODES.region) {
        document.querySelector(`#Layer${selectedLayer}`).classList.remove("active");
        document.querySelector(`#${selectedTileName}`).classList.remove("active");
        editMode = EDIT_MODES.region;
    }
});

document.querySelector(`#Layer${selectedLayer}`).classList.add("active");
document.querySelector(`#${selectedTileName}`).classList.add("active");

document.querySelector("#save").addEventListener("click", function(e) {
    console.log("saving");
    console.log(gameMap.getJSON());
});
