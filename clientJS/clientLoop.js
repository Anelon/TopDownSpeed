import Map from "../sharedJS/map.js";
import Vec2 from "../sharedJS/vec2.js";
import Time from "./time.js";
import CanvasWrapper from "./canvasWrapper.js";
//import { Moveable } from "./entity.js";
//import Monster from "./monster.js";
import PlayerController from "./playerController.js";
import CHANNELS from "../sharedJS/channels.js";
import Projectile from "../sharedJS/projectile.js";
import { TYPES } from "../sharedJS/enums.js";
import Player from "../sharedJS/player.js";

//setup the sockets and listening
// @ts-ignore
let socket = io();

//global defaults
const defaultImg = './img/arrow.png';

let canvas = new CanvasWrapper();
let map = new Map(canvas.width, canvas.height);
let time = new Time();

let bounds = canvas.getBoundingClientRect();
let you;

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
    you = new PlayerController(locationVec, "Player " + name, imgSrc, speed, maxHealth, bounds);
    you.id = id;
    //this should be redundant as when you span you probably should have full health
    you.currHealth = currHealth;
    if (!playerExists) {
        // @ts-ignore
        map.addPlayer(you);
    } else {

    }
    //you.updateInfo(playerInfoJson);
    requestAnimationFrame(frame);
});
socket.on(CHANNELS.newProjectile, function(newProjectile) {
    const updated = JSON.parse(newProjectile.json);
    //console.log("From Server", updated);
    const projectile = Projectile.makeFromJSON(updated);
    map.addProjectile(projectile);
    canvas.addDrawable(projectile);
});
socket.on(CHANNELS.playerMove, function(playerInfo) {
    const updated = JSON.parse(playerInfo.json);
    //console.log(updated);
    const newPlayer = map.updatePlayer(updated);
    if(newPlayer) canvas.addDrawable(/** @type {Player} */(newPlayer));
});
socket.on(CHANNELS.deletePlayer, function(playerID) {
    console.log("Deleting", playerID);
    map.removePlayer(playerID);
    canvas.removeDrawable(playerID);
});

//let enemy = new Monster(new Vec2(map.width/2, map.height/2), defaultImg, defaultSpeed);
//map.players.push(enemy);

//Updates the game state
/**
 * 
 * @param {Time} time 
 * @param {number} step Tick rate of server
 */
function update(time, step) {
    //TODO move to serverside 
    //change to send and receive information
    you.update(time, step, map, canvas, socket);
    const deleteArray = map.update(time, step, canvas);
    for(const item of deleteArray) {
        if(item.type === TYPES.player) {
            //ignore
        } else {
            map.removeProjectile(/** @type {Projectile} */(item));
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
    //clear the map
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
