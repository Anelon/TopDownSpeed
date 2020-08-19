import Map from "./clientMap.mjs";
import Vec2 from "./vec2.mjs";
import Time from "./time.mjs";
import CanvasWrapper from "./canvasWrapper.mjs";
//import { Moveable } from "./entity.mjs";
//import Monster from "./monster.mjs";
import PlayerController from "./playerController.mjs";
import CHANNELS from "./channels.mjs";

//setup the sockets and listening
let socket = io();

//figure out resizing
//https://stackoverflow.com/questions/1664785/resize-html5-canvas-to-fit-window

//global defaults
const defaultImg = './img/arrow.png';

let canvas = new CanvasWrapper();
let map = new Map(canvas.width, canvas.height, canvas, socket);
let time = new Time();

//declare players (will get moved to server when player connects)
//makes new player with map, Vec2 location, string name, img, and number speed
let bounds = canvas.getBoundingClientRect();
let you;

//set up socket listening

//wait for the server to give the player its location
console.log(CHANNELS.newPlayer);
socket.on(CHANNELS.newPlayer, function(playerInfo) {
    let playerInfoJson = JSON.parse(playerInfo.json);

    //pull the information from json
    let location = new Vec2(playerInfoJson.location.x, playerInfoJson.location.y);
    //let name = playerInfoJson.name;
    let name = "player " + playerInfoJson.id;
    let imgSrc = playerInfoJson.imgSrc;
    let speed = playerInfoJson.speed;
    //make new player
    you = new PlayerController(location, name, imgSrc, speed, bounds, socket);
    map.players.push(you);
    //you.updateInfo(playerInfoJson);
    requestAnimationFrame(frame);
});

//let enemy = new Monster(new Vec2(map.width/2, map.height/2), defaultImg, defaultSpeed);
//map.players.push(enemy);

//Updates the game state
function update(time, step) {
    //TODO move to serverside 
    //change to send and receive information
    map.update(time, step);
}

const step = 1/30; // 30 tics per second

function render(you) {
    //clear the map
    canvas.clear();

    //probably best to move this to update rather than render
    if (you.moved || you.mouse.changed) {
        // if player moved send update to server
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
