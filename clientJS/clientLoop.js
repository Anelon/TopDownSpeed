import CollisionEngine from "../sharedJS/collisionEngine.js";
import Vec2 from "../sharedJS/vec2.js";
import Time from "./time.js";
import CanvasWrapper from "./canvasWrapper.js";
//import { Moveable } from "./entity.js";
//import Monster from "./monster.js";
import PlayerController from "./playerController.js";
import CHANNELS from "../sharedJS/channels.js";
import Projectile from "../sharedJS/projectile.js";
import { TYPES, CATEGORY } from "../sharedJS/enums.js";
import Player from "../sharedJS/player.js";
import Waterball from "../sharedJS/waterball.js";
import WaterballAbility from "../sharedJS/waterballAbility.js";
import { Circle } from "../sharedJS/shapes.js";
import { makeFromJSON } from "../sharedJS/utils.js";

//setup the sockets and listening
// @ts-ignore
let socket = io();

let canvas = new CanvasWrapper();
let collisionEngine = new CollisionEngine(canvas.width, canvas.height);
let time = new Time();

let bounds = canvas.getBoundingClientRect();
/** @type {PlayerController} */
let you;

let location = new Vec2(100,100);
let waterBall = new Waterball(location, "test", WaterballAbility.IMAGE, 0, 1, new Vec2(1,0), 100, 100, new Circle(location, 32), you);
canvas.addDrawable(waterBall.makeSprite());

//set up socket listening

//wait for the server to give the player its location
socket.on(CHANNELS.newPlayer, function(playerInfo) {
    let playerExists = false;
    if(you) {
        playerExists = true;
        console.log("Already a player controller");
    }
    let playerInfoJson = JSON.parse(playerInfo.json);

    //pull the information from json
    const {
        location, name, imgSrc, speed, currHealth, maxHealth, id
    } = playerInfoJson;
    const locationVec = new Vec2(location.x, location.y);
    //make new player
    you = new PlayerController(locationVec, "Player " + name, imgSrc, speed, maxHealth, bounds, 4);
    you.id = id;
    //this should be redundant as when you spawn you probably should have full health
    you.currHealth = currHealth;
    if (!playerExists) {
        collisionEngine.addPlayer(you);
    } else {

    }
    requestAnimationFrame(frame);
});
socket.on(CHANNELS.newProjectile, function(newProjectile) {
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
        console.log("Ability");
        // @ts-ignore
        canvas.addDrawable(projectile.makeSprite());
    }
});
socket.on(CHANNELS.playerMove, function(playerInfo) {
    const updated = JSON.parse(playerInfo.json);
    //console.log(updated);
    const newPlayer = collisionEngine.updatePlayer(updated);
    if(newPlayer) canvas.addDrawable(/** @type {Player} */(newPlayer));
});
socket.on(CHANNELS.deletePlayer, function(playerID) {
    console.log("Deleting", playerID);
    collisionEngine.removePlayer(playerID);
    canvas.removeDrawable(playerID);
});

//let enemy = new Monster(new Vec2(collisionEngine.width/2, collisionEngine.height/2), defaultImg, defaultSpeed);
//collisionEngine.players.push(enemy);

//Updates the game state
/**
 * 
 * @param {Time} time 
 * @param {number} step Tick rate of server
 */
function update(time, step) {
    //update the PlayerController
    you.update(time, step, collisionEngine, canvas, socket);

    //run the collision engine and catch anything flagged for deleting
    const deleteArray = collisionEngine.update(time, step, canvas);
    for(const item of deleteArray) {
        if(item.category === CATEGORY.player) {
            //TODO respawn player (or have server respawn player)
        } else {
            console.log("Deleting", item)
            collisionEngine.removeProjectile(/** @type {Projectile} */(item));
            canvas.removeDrawable(item);
        }
    }
}

const step = 1/30; // 30 tics per second

/**
 * Renders the canvas
 * @param {PlayerController} you 
 */
function render(you) {
    //clear the collisionEngine
    canvas.clear();

    //probably best to move this to update rather than render
    if (you.moved || you.mouse.changed) {
        // if player moved send update to server
        //console.log(you, you.makeObject());
        socket.emit("playerMove", you.makeObject());
    }

    canvas.render(you);
    you.draw(canvas);

    requestAnimationFrame(frame);
}

//based off of this site
//https://codeincomplete.com/articles/javascript-game-foundations-the-game-loop/
function frame() {
    //console.log(you);
    time.update();
    //console.log(time.dt);
    //run frames while they need to run fixed timestep gameloop
    while(time.dt > step) {
        time.dt -= step;
        update(time, step);
    }
    render(you);
    time.last = time.now;
}
