import Vec2 from "../../sharedJS/vec2.js";
import CanvasWrapper from "../canvasWrapper.js";
import GameMap from "../../sharedJS/map/gameMap.js";
import { TILES, TILE_NAMES, REGIONS, TILE_OPTIONS, MAPNAME, DECORATION_NAMES } from "../../sharedJS/utils/enums.js";
import PlayerController from "../playerController.js";
import Time from "../../sharedJS/utils/time.js";
import CollisionEngine from "../../sharedJS/collisionEngine.js";
import ClientLoop from "../clientLoop.js";
import { loadDecorationSprites, loadTileSprites } from "../sprites.js";

if(document.readyState === 'complete') {
} else {
    document.addEventListener("readystatechange", function (e) {
        const readyState = /** @type {Document} */(e.target).readyState;
        if(readyState === "complete") {
            console.info("Document is ready");
            loadTileSprites();
            loadDecorationSprites();
        }
    });
}

fetch(`./api/getMap/${MAPNAME}`)
.then(function(res) {
    if(res.status !== 200) {
        console.error("Error occured", res.status);
        return;
    }
    res.json().then(function(data) {
        gameMap = GameMap.makeFromJSON(data.data);
        //set the new gamemap
        clientLoop.setGameMap(gameMap);
    });
})
.catch(function(err) {
    console.error("Fetch Error", err);
});

//Globals
const voidWidth = 5;
const tileSize = new Vec2(32,32);
let gameMap = new GameMap(voidWidth, new Vec2(15, 50), tileSize.clone());
const pixelDims = gameMap.dimentions.multiplyVec(tileSize);
const collisionEngine = new CollisionEngine(pixelDims.x, pixelDims.y);
collisionEngine.setRegions(gameMap.generateRegions());
// @ts-ignore
const time = new Time(performance);

const EDIT_MODES = {
    tile: "tile",
    decoration: "decoration",
    region: "region",
}

//Selections
let editMode = EDIT_MODES.tile;
let selectedLayer = 1;
let selectedTileName = TILE_NAMES.g;
let selectedDecoration = DECORATION_NAMES.redPillar;
let selectedRegion = Object.keys(REGIONS)[0];

//set up canvas
const canvas = new CanvasWrapper({tileSize, canvasSize: gameMap.dimentions.clone().multiplyVecS(tileSize)});
const playerController = new PlayerController(new Vec2(100, 100), "Player","player", 500, 200, 2, canvas, false);
playerController.silenced = true;
canvas.setCenter(playerController.location);
playerController.draw(canvas);

//--- Initialize the client loop ---//
const clientLoop = new ClientLoop(playerController, gameMap, canvas, time, collisionEngine);
clientLoop.start();

//reagions for selections
let regionStart = new Vec2();
let regionEnd = new Vec2();

canvas.addEventListener("mousedown", function(e) {
    const clickLocation = new Vec2(e.offsetX, e.offsetY);
    regionStart = clickLocation.addS(canvas.topRight).multiplyVec(canvas.tileSize.invert()).floorS();
});

canvas.addEventListener("mouseup", function(e) {
    const clickLocation = new Vec2(e.offsetX, e.offsetY);
    regionEnd = clickLocation.addS(canvas.topRight).multiplyVec(canvas.tileSize.invert()).floorS();
    if(editMode === EDIT_MODES.tile) {
        /** @type {NodeListOf<HTMLInputElement>} */
        const traversal = document.querySelectorAll("input[name='traversal']");
        const traversalObject = {
            walkable: false,
            passable: true
        };
        for (const elem of traversal) {
            traversalObject[elem.value] = elem.checked;
        }
        const tile = TILES[selectedTileName].clone().setTraversal(traversalObject);
        gameMap.update(regionStart, regionEnd, selectedLayer, tile);
        collisionEngine.setStatics(gameMap.generateStatic());
    } else if(editMode === EDIT_MODES.decoration) {
        /** @type {NodeListOf<HTMLInputElement>} */
        const traversal = document.querySelectorAll("input[name='traversal']");
        //build traversal object
        const traversalObject = {
            walkable: false,
            passable: true
        };
        for (const elem of traversal) {
            traversalObject[elem.value] = elem.checked;
        }
        const tile = TILES[selectedDecoration].clone().setTraversal(traversalObject);
        gameMap.update(regionStart, regionEnd, selectedLayer, tile);
        collisionEngine.setStatics(gameMap.generateStatic());
    } else if (editMode === EDIT_MODES.region) {
        gameMap.addRegion(regionStart, regionEnd, REGIONS[selectedRegion], selectedRegion);
        collisionEngine.setRegions(gameMap.generateRegions());
    }
});

//--- set up tile selection ---//
const tileSelectList = document.querySelector("#tileSelectList");
for(const tileName of Object.values(TILE_NAMES)) {
    if(!TILES[tileName] && tileName !== TILE_NAMES[" "]) continue;
    const tileSelect = document.createElement("li");
    tileSelect.innerText = tileName;
    tileSelect.setAttribute("id", tileName);
    tileSelectList.appendChild(tileSelect);
}

//--- set up decoration selection ---//
const decorationSelectList = document.querySelector("#decorationSelectList");
for(const decorationName of Object.values(DECORATION_NAMES)) {
    if(!TILES[decorationName]) continue;
    const decorationSelect = document.createElement("li");
    decorationSelect.innerText = decorationName;
    decorationSelect.setAttribute("id", decorationName);
    decorationSelectList.appendChild(decorationSelect);
}

//--- set up layer selection ---//
const layerSelectList = document.querySelector("#layerSelectList");
for(let i = 0; i < GameMap.numLayers; i++) {
    const layerSelect = document.createElement("li");
    layerSelect.innerText = "Layer " + i;
    layerSelect.setAttribute("id", "Layer" + i);
    layerSelectList.appendChild(layerSelect);
}

//--- set up traversal selection ---//
const traversalSelectList = document.querySelector("#traversalSelectList");
for(const option of TILE_OPTIONS) {
    const traversalSelectDiv = document.createElement("div");
    //set up checkbox
    const traversalSelect = document.createElement("input");
    traversalSelect.setAttribute("type", "checkbox");
    traversalSelect.setAttribute("id", option);
    traversalSelect.setAttribute("name", "traversal");
    traversalSelect.setAttribute("value", option);
    traversalSelect.setAttribute("checked", "true");
    //set up label
    const traversalSelectLabel = document.createElement("label");
    traversalSelectLabel.setAttribute("for", option);
    traversalSelectLabel.innerText = option;
    //append to div and then to list
    traversalSelectDiv.appendChild(traversalSelect);
    traversalSelectDiv.appendChild(traversalSelectLabel);

    traversalSelectList.appendChild(traversalSelectDiv);
}


//--- set up regions selection ---//
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
    //switch edit mode
    if(editMode !== EDIT_MODES.tile) {
        document.querySelectorAll(`.selectList > li`).forEach((elem) => elem.classList.remove("active"));
        document.querySelector(`#Layer${selectedLayer}`).classList.add("active");
        editMode = EDIT_MODES.tile;
    }
    document.querySelector(`#${selectedTileName}`).classList.add("active");
});

//--- set up event listeners ---//
decorationSelectList.addEventListener("click", function(e) {
    const decorationName = /** @type HTMLElement */(e.target).innerText;
    document.querySelector(`#${selectedDecoration}`).classList.remove("active");
    selectedDecoration = decorationName;
    //switch edit mode
    if(editMode !== EDIT_MODES.decoration) {
        document.querySelectorAll(`.selectList > li`).forEach((elem) => elem.classList.remove("active"));
        document.querySelector(`#Layer${selectedLayer}`).classList.add("active");
        editMode = EDIT_MODES.decoration;
    }
    document.querySelector(`#${selectedDecoration}`).classList.add("active");
});

//--- set up layer selection ---//
layerSelectList.addEventListener("click", function(e) {
    const layerSelect = /** @type HTMLElement */(e.target).innerText;
    document.querySelector(`#Layer${selectedLayer}`).classList.remove("active");
    selectedLayer = parseInt(layerSelect.split(" ")[1]);
    //switch edit mode
    if(editMode !== EDIT_MODES.tile) {
        document.querySelectorAll(`.selectList > li`).forEach((elem) => elem.classList.remove("active"));
        editMode = EDIT_MODES.tile;
    }
    document.querySelector(`#Layer${selectedLayer}`).classList.add("active");
});

regionSelectList.addEventListener("click", function(e) {
    const regionSelect = /** @type HTMLElement */(e.target).innerText;
    document.querySelector(`#${selectedRegion}`).classList.remove("active");
    selectedRegion = regionSelect;
    document.querySelector(`#${selectedRegion}`).classList.add("active");
    //switch edit mode
    if(editMode !== EDIT_MODES.region) {
        document.querySelectorAll(`.selectList > li`).forEach((elem) => elem.classList.remove("active"));
        editMode = EDIT_MODES.region;
    }
    document.querySelector(`#${selectedRegion}`).classList.add("active");
});

document.querySelector(`#Layer${selectedLayer}`).classList.add("active");
document.querySelector(`#${selectedTileName}`).classList.add("active");

document.querySelector("#save").addEventListener("click", function(e) {
    console.info("saving");
    console.info(gameMap.saveMap());
});
