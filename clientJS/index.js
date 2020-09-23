import CollisionEngine from "../sharedJS/collisionEngine.js";
import Vec2 from "../sharedJS/vec2.js";
import Time from "../sharedJS/utils/time.js";
import CanvasWrapper from "./canvasWrapper.js";
import PlayerController from "./playerController.js";
import CHANNELS from "../sharedJS/utils/channels.js";
import Player from "../sharedJS/player.js";
import Waterball from "../sharedJS/ability/waterball.js";
import { Circle } from "../sharedJS/shapes.js";
import { makeFromJSON } from "../sharedJS/utils/utils.js";
import Fireball from "../sharedJS/ability/fireball.js";
import PlantSeed from "../sharedJS/ability/plantSeed.js";
import GameMap from "../sharedJS/map/gameMap.js";
import ClientLoop from "./clientLoop.js";

//setup the sockets and listening
// @ts-ignore
let socket = io();

//Globals
const numLayers = 4;
const tileSize = new Vec2(32,32);
const gameMap = new GameMap(numLayers, new Vec2(15, 50), tileSize.clone());
const pixelDims = gameMap.dimentions.multiplyVec(tileSize);
const collisionEngine = new CollisionEngine(pixelDims.x, pixelDims.y);
// @ts-ignore
const time = new Time(performance);

//set up canvas
const canvas = new CanvasWrapper({tileSize, canvasSize: gameMap.dimentions.clone().multiplyVecS(tileSize)});
let bounds = canvas.getBoundingClientRect();

/** @type {PlayerController} */
let you;

//spawn one of each of the abilities to preload the image
let location = new Vec2(-100, -100);
let waterBall = new Waterball(location, "test", 0, 1, new Vec2(1, 0), 100, 100, new Circle(location, 0), you);
let fireBall = new Fireball(location, "test", 0, 1, new Vec2(1, 0), 100, 100, new Circle(location, 0), you);
let plantSeed = new PlantSeed(location, "test", 0, 1, new Vec2(1, 0), 100, 100, new Circle(location, 0), you);
canvas.addDrawable(waterBall.makeSprite());
canvas.addDrawable(fireBall.makeSprite());
canvas.addDrawable(plantSeed.makeSprite());

//set up socket listening
//wait for the server to give the player its location
socket.on(CHANNELS.newPlayer, function (playerInfo) {
    let playerExists = false;
    if (you) {
        playerExists = true;
        console.log("Already a player controller");
    }
    let playerInfoJson = JSON.parse(playerInfo.json);

    //pull the information from json
    const {
        location, name, imgSrc, speed, currHealth, maxHealth, id, scale
    } = playerInfoJson;
    const locationVec = new Vec2(location.x, location.y);
    //make new player
    you = new PlayerController(locationVec, "Player " + name, imgSrc, speed, maxHealth, scale, canvas);
    you.id = id;
    //this should be redundant as when you spawn you probably should have full health
    you.currHealth = currHealth;
    if (!playerExists) {
        collisionEngine.addPlayer(you);
    } else {

    }
    //start up the client loop
    new ClientLoop(you, gameMap, canvas, time, collisionEngine, socket);
});

socket.on(CHANNELS.newProjectile, function (newProjectile) {
    const updated = JSON.parse(newProjectile.json);
    console.log("From Server", updated);
    const projectile = makeFromJSON(newProjectile);
    collisionEngine.addProjectile(projectile);
    //TODO make Sprite (make canvaswrapper compattable with sprites)
    console.log(projectile);
    if (newProjectile.type === "Projectile") {
        console.log("projectile");
        canvas.addDrawable(projectile);
    } else {
        console.log("Ability", projectile);
        // @ts-ignore
        canvas.addDrawable(projectile.makeSprite());
    }
});

socket.on(CHANNELS.playerMove, function (playerInfo) {
    const updated = JSON.parse(playerInfo.json);
    //console.log(updated);
    const newPlayer = collisionEngine.updatePlayer(updated);
    if (newPlayer) canvas.addDrawable(/** @type {Player} */(newPlayer));
});

socket.on(CHANNELS.deletePlayer, function (playerID) {
    console.log("Deleting", playerID);
    collisionEngine.removePlayer(playerID);
    canvas.removeDrawable(playerID);
});
