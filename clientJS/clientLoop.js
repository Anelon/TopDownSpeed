import Map from "./clientMap.mjs";
import Vec2 from "./vec2.mjs";
import Time from "./time.mjs";
import CanvasWrapper from "./canvasWrapper.mjs";
//import { Moveable } from "./entity.mjs";
//import Monster from "./monster.mjs";
import PlayerController from "./playerController.mjs";

let socket = io();

//figure out resizing
//https://stackoverflow.com/questions/1664785/resize-html5-canvas-to-fit-window

//global defaults
const defaultImg = './img/arrow.png';


let canvas = new CanvasWrapper();
let map = new Map(canvas.width, canvas.height, canvas);
let time = new Time();

//declare players (will get moved to server when player connects)
//makes new player with map, Vec2 location, string name, img, and number speed
let bounds = canvas.getBoundingClientRect();
let you = new PlayerController(new Vec2(10,10), "Player1", defaultImg, 100, bounds);
map.players.push(you);

//let enemy = new Monster(new Vec2(map.width/2, map.height/2), defaultImg, defaultSpeed);
//map.players.push(enemy);

//Updates the game state
function update(time) {
    //TODO move to serverside 
    //change to send and receive information
    map.update(time);
}

const step = 1/60; // 60 tics per second

function render(you) {
    //clear the map
    canvas.clear();
    //map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);

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
    time.update();
    //run frames while they need to run fixed timestep gameloop
    while(time.dt > step) {
        time.dt = time.dt - step;
        update(time, step);
    }
    render(you);
    time.last = time.now;
}
requestAnimationFrame(frame);
