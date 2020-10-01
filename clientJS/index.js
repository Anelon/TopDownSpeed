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

//setup the sockets and listening
// @ts-ignore
let socket = io();

//Globals
const voidWidth = 5;
const tileSize = new Vec2(32,32);
let gameMap = new GameMap(voidWidth, new Vec2(15, 50), tileSize.clone());
let pixelDims = gameMap.dimentions.multiplyVec(tileSize);
let collisionEngine = new CollisionEngine(pixelDims.x, pixelDims.y);
// @ts-ignore
let time = new Time(performance);

//set up canvas
let canvas = new CanvasWrapper({tileSize, canvasSize: gameMap.dimentions.clone().multiplyVecS(tileSize)});

/** @type {PlayerController} */
let playerController;
/** @type {ClientLoop} */
let clientLoop;

//spawn one of each of the abilities to preload the image
const location = new Vec2(-100, -100);
const waterBall = new Waterball(location, "test", 0, 1, new Vec2(1, 0), 100, 100, new Circle(location, 0), playerController);
const fireBall = new Fireball(location, "test", 0, 1, new Vec2(1, 0), 100, 100, new Circle(location, 0), playerController);
const plantSeed = new PlantSeed(location, "test", 0, 1, new Vec2(1, 0), 100, 100, new Circle(location, 0), playerController);
canvas.addDrawable(waterBall.makeSprite());
canvas.addDrawable(fireBall.makeSprite());
canvas.addDrawable(plantSeed.makeSprite());

//set up socket listening
//wait for the server to give the player its location
socket.on(CHANNELS.newPlayer, function (playerInfo) {
    let playerExists = false;
    if (playerController) {
        playerExists = true;
        //reset everything
        gameMap = new GameMap(voidWidth, new Vec2(15, 50), tileSize.clone());
        pixelDims = gameMap.dimentions.multiplyVec(tileSize);
        collisionEngine = new CollisionEngine(pixelDims.x, pixelDims.y);
        // @ts-ignore
        time = new Time(performance);

        //set up canvas
        canvas = new CanvasWrapper({ tileSize, canvasSize: gameMap.dimentions.clone().multiplyVecS(tileSize) });
    }

    //parse the player's info
    let playerInfoJson = JSON.parse(playerInfo.json);

    //pull the information from json
    const {
        location, spawnLocation, name, imgSrc, speed, currHealth, maxHealth, id, scale
    } = playerInfoJson;
    const locationVec = new Vec2(location.x, location.y);
    const spawnVec = new Vec2(spawnLocation.x, spawnLocation.y);
    //make new player
    playerController = new PlayerController(locationVec, "Player " + name, imgSrc, speed, maxHealth, scale, canvas);
    playerController.id = id;
    playerController.spawnLocation = spawnVec;
    //this should be redundant as when playerController spawn you probably should have full health
    playerController.currHealth = currHealth;
    if (!playerExists) {
        collisionEngine.addPlayer(playerController);
    } else {
        console.log("Already player controller");
    }
    //start up the client loop
    clientLoop = new ClientLoop(playerController, gameMap, canvas, time, collisionEngine, socket);

    //fetch the map
    let mapName = "map";
    fetch(`./api/getMap/${mapName}`)
        .then(function (res) {
            if (res.status !== 200) {
                console.error("Error occured", res.status);
                return;
            }
            res.json().then(function (data) {
                gameMap = GameMap.makeFromJSON(data.data);
                //set the new gamemap
                clientLoop.setGameMap(gameMap);
            });
        })
        .catch(function (err) {
            console.error("Fetch Error", err);
        });
});

socket.on(CHANNELS.newProjectile, function (newProjectile) {
    const updated = JSON.parse(newProjectile.json);
    const projectile = projectileFromJSON(newProjectile);
    collisionEngine.addProjectile(projectile);
    if (newProjectile.type === "Projectile") {
        canvas.addDrawable(projectile);
    } else {
        // @ts-ignore
        canvas.addDrawable(projectile.makeSprite());
    }
});

socket.on(CHANNELS.playerMove, function (playerInfo) {
    const updated = JSON.parse(playerInfo.json);
    const newPlayer = collisionEngine.updatePlayer(updated);
    if (newPlayer) canvas.addDrawable(/** @type {Player} */(newPlayer));
});

socket.on(CHANNELS.deletePlayer, function (playerID) {
    collisionEngine.removePlayer(playerID);
    canvas.removeDrawable(playerID);
});