import Map from "./map.mjs";
import Vec2 from "./vec2.mjs";
import { Moveable } from "./entity.mjs";
import Monster from "./monster.mjs";
import { Player, PlayerController } from "./player.mjs";

//figure out resizing
//https://stackoverflow.com/questions/1664785/resize-html5-canvas-to-fit-window

//global defaults
const defaultSpeed = 100;
const defaultImg = './img/arrow.png';


let map = new Map();

let players = [];
let monsters = [];

//declair players (will get moved to server when player connects)
//makes new player with map, Vec2 location, string name, img, and number speed
let you = new PlayerController(map, new Vec2(10,10), "Player1", defaultImg, defaultSpeed);
players.push(you);

let enemy = new Monster(map, new Vec2(map.width/2, map.height/2), defaultImg, defaultSpeed);
monsters.push(enemy);

//Updates the game state
function update(dt) {
    you.update(dt);

    //TODO move to serverside 
    //change to send and receive information
    for(let projectile of map.projectiles) {
        projectile.update(dt);
    }
    for(let monster of monsters) {
        monster.update(dt);
    }
}

// only render when the DOM is ready to display the mouse position
function render(dt) {
    //clear the map
    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);

    if(you.moved || (you.image.complete && you.mouse.changed)) { 
        // if player moved send update to server
    }
    for(let projectile of map.projectiles) {
        projectile.draw();
    }
    you.draw();
    requestAnimationFrame(frame);
}

let now, dt = 0;
let last = performance.now();
const step = 1/60; // 60 tics per second

//based off of this site
//https://codeincomplete.com/articles/javascript-game-foundations-the-game-loop/
function frame() {
    now = performance.now();
    //calculate dt
    dt = dt + Math.min(1, (now - last) / 1000);
    //run frames while they need to run fixed timestep gameloop
    while(dt > step) {
        dt = dt - step;
        update(step);
    }
    render(dt);
    last = now;
}
requestAnimationFrame(frame);
