import Map from "./map.mjs";
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
let map = new Map(canvas.width, canvas.height);
let time = new Time();

//declair players (will get moved to server when player connects)
//makes new player with map, Vec2 location, string name, img, and number speed
let bounds = canvas.getBoundingClientRect();
let you = new PlayerController(new Vec2(10,10), "Player1", defaultImg, 0, bounds);
map.players.push(you);

//let enemy = new Monster(new Vec2(map.width/2, map.height/2), defaultImg, defaultSpeed);
//map.players.push(enemy);

//Updates the game state
function update(now, dt) {
    //TODO move to serverside 
    //change to send and receive information
    time.update();
    map.update(time);
}

let now, dt = 0;
let last = performance.now();
const step = 1/60; // 60 tics per second

function render(dt, you) {
    //clear the map
    canvas.clear();
    //map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);

    //probably best to move this to update rather than render
    if (you.moved || you.mouse.changed) {
        // if player moved send update to server
        socket.emit("playerMove", you.makeObject());
    }

    for (let projectile of map.projectiles) {
        projectile.draw(map);
    }
    for (let player of map.players) {
        player.draw(canvas);
    }

    requestAnimationFrame(frame);
}

//based off of this site
//https://codeincomplete.com/articles/javascript-game-foundations-the-game-loop/
function frame() {
    now = performance.now();
    //calculate dt
    dt = dt + Math.min(1, (now - last) / 1000);
    //run frames while they need to run fixed timestep gameloop
    while(dt > step) {
        dt = dt - step;
        update(now, step);
    }
    render(dt, you);
    last = now;
}
requestAnimationFrame(frame);
