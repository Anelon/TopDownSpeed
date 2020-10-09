import CollisionEngine from "../sharedJS/collisionEngine.js";
import Vec2 from "../sharedJS/vec2.js";
import Time from "../sharedJS/utils/time.js";
import CanvasWrapper from "./canvasWrapper.js";
import PlayerController from "./playerController.js";
import CHANNELS from "../sharedJS/utils/channels.js";
import Player from "../sharedJS/player.js";
import Waterball from "../sharedJS/ability/waterball.js";
import { Circle } from "../sharedJS/shapes.js";
import { projectileFromJSON } from "../sharedJS/utils/utils.js";
import Fireball from "../sharedJS/ability/fireball.js";
import PlantSeed from "../sharedJS/ability/plantSeed.js";
import GameMap from "../sharedJS/map/gameMap.js";
import ClientLoop from "./clientLoop.js";
import Dragon from "../sharedJS/dragon.js";

//setup the sockets and listening
// @ts-ignore
let socket = io();

let documentReady = false;

if(document.readyState === 'complete') {
    main();
} else {
    document.addEventListener("readystatechange", function (e) {
        const readyState = /** @type {Document} */(e.target).readyState;
        if(readyState === "complete") {
            console.log("Document is ready");
            /** @type {NodeListOf<HTMLImageElement>} */
            const imgs = (document.querySelectorAll("img"));
            for(const img of imgs){ 
                console.log(img.src, img.complete);
            }
            documentReady = true;
            main();
        }
    });
}

let ready = false;
/** @type {HTMLButtonElement} */
const readyButton = document.querySelector("button#ready");
/** @type {HTMLParagraphElement} */
const errorP = document.querySelector("p#error");
/** @type {HTMLInputElement} */
const displayNameInput = document.querySelector("input#name");
/** @type {HTMLDivElement} */
const introMessageDiv = document.querySelector("div#introMessage");
/** @type {HTMLDivElement} */
const endMessageDiv = document.querySelector("div#endMessage");

let displayName = "Player";

readyButton.disabled = true;
readyButton.addEventListener("click", (e) => {
    ready = !ready;
    if(ready) {
        readyButton.innerText = "Unready";
        displayName = displayNameInput.value;
        displayNameInput.disabled = true;
        socket.emit(CHANNELS.ready, {displayName, ready})
    } else {
        readyButton.innerText = "Ready";
        displayNameInput.disabled = false;
    }
});

/**
 * @param {string} mapName
 */
async function loadMap(mapName) {
    const res = await fetch(`./api/getMap/${mapName}`);
    if (res.status !== 200) {
        console.error("Error occured", res.status);
        return;
    }
    const data = await res.json();
    //set the new gamemap
    return GameMap.makeFromJSON(data.data);
}

let clientLoop = null;
let playerInfoJson = null;;

async function main() {
    //wait for document and playerInfo to be ready
    if(!playerInfoJson || !documentReady) return;
    const mapName = "map";
    //load the map
    errorP.innerText = "Loading Map";
    const gameMap = await loadMap(mapName);
    //Globals
    const pixelDims = gameMap.dimentions.multiplyVec(gameMap.tileSize);
    const collisionEngine = new CollisionEngine(pixelDims.x, pixelDims.y);

    // @ts-ignore
    const time = new Time(performance);

    //set up canvas
    const canvas = new CanvasWrapper({ tileSize: gameMap.tileSize, canvasSize: pixelDims.clone() });

    //spawn one of each of the abilities to preload the image
    const initLocation = new Vec2(-1000, -1000);
    const waterBall = new Waterball(initLocation, "test", 0, 1, new Vec2(1, 0), 100, 100, new Circle(initLocation, 0), null);
    const fireBall = new Fireball(initLocation, "test", 0, 1, new Vec2(1, 0), 100, 100, new Circle(initLocation, 0), null);
    const plantSeed = new PlantSeed(initLocation, "test", 0, 1, new Vec2(1, 0), 100, 100, new Circle(initLocation, 0), null);
    const dragon = new Dragon(initLocation, "test", null, new Vec2(1,0));
    canvas.addDrawable(waterBall.makeSprite());
    canvas.addDrawable(fireBall.makeSprite());
    canvas.addDrawable(plantSeed.makeSprite());
    canvas.addEventListener("contextMenu", (e) => {
        console.log("context Menu", e);
        e.preventDefault();
        return false;
    });

    socket.on(CHANNELS.newProjectile, function (newProjectile) {
        const updated = JSON.parse(newProjectile.json);
        const projectile = projectileFromJSON(newProjectile);
        if(!projectile.id.includes("projectile_")) {
            console.error("Bad Projectile", updated.id);
        }
        collisionEngine.addDynamic(projectile);
        if (newProjectile.type === "Projectile") {
            canvas.addDrawable(projectile);
        } else {
            // @ts-ignore
            canvas.addDrawable(projectile.makeSprite());
        }
    });

    socket.on(CHANNELS.playerMove, function (playerInfo) {
        const updated = JSON.parse(playerInfo.json);
        const newPlayer = collisionEngine.updatePlayer(updated, playerInfo.objectives);
        if (newPlayer) canvas.addDrawable(/** @type {Player} */(newPlayer));
        //if just updated the player controller make sure the healthbar is updated
        if(updated.id === playerController.id) {
            //update healthbar
            playerController.hurt(0, "");
        }
    });

    socket.on(CHANNELS.kill, function (killMessage) {
        playerController.kill();
    });

    socket.on(CHANNELS.deleteProjectile, function (projectileID) {
        if(collisionEngine.dynamics.has(projectileID)) {
            collisionEngine.removeDynamic(projectileID);
            canvas.removeDrawable(projectileID);
        } else {
            console.error(projectileID, " Not Found");
        }
    });

    socket.on(CHANNELS.deletePlayer, function (playerID) {
        collisionEngine.removePlayer(playerID);
        canvas.removeDrawable(playerID);
    });

    socket.on(CHANNELS.startGame, function (startText) {
        if(startText === "start") {
            //reset player controller
            playerController.kill();
        }
        //hide the intro message ready screen
        introMessageDiv.hidden = true;
        clientLoop.start();
    });

    socket.on(CHANNELS.endGame, function (winLaneName) {
        /** @type {HTMLSpanElement} */
        const winLaneNameSpan = document.querySelector("span#winLaneName");
        winLaneNameSpan.innerText = winLaneName;
        //hide the intro message ready screen
        endMessageDiv.hidden = false;
        clientLoop.stop();
    });

    //pull the information from json
    const {
        location, spawnLocation, name, imgSrc, speed, currHealth, maxHealth, id, scale
    } = playerInfoJson;
    const locationVec = new Vec2(location.x, location.y);
    const spawnVec = new Vec2(spawnLocation.x, spawnLocation.y);
    //make new player
    const playerController = new PlayerController(locationVec, "Player " + name, imgSrc, speed, maxHealth, scale, canvas);
    playerController.id = id;
    playerController.spawnLocation = spawnVec;
    //this should be redundant as when playerController spawn you probably should have full health
    playerController.currHealth = currHealth;
    //stun the player so they can not move until game starts
    playerController.stunned = true;
    collisionEngine.addPlayer(playerController);

    //send request to server saying ready to receive game data
    socket.emit(CHANNELS.gameData, "game");
    //reactivate the ready button
    readyButton.disabled = false;
    errorP.innerText = "";

    //start up the client loop
    clientLoop = new ClientLoop(playerController, gameMap, canvas, time, collisionEngine, socket);
}

//set up socket listening
//wait for the server to give the player its location
socket.on(CHANNELS.newPlayer, function (playerInfo) {
    //parse the player's info
    playerInfoJson = JSON.parse(playerInfo.json);
    if(clientLoop) {
        //stop the old clientLoop
        clientLoop.running = false;
    }
    main();
});