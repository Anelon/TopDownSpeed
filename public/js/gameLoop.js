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

//declair players (will get moved to server when player connects)
//makes new player with map, Vec2 location, string name, img, and number speed
let you = new PlayerController(map, new Vec2(10,10), "Player1", defaultImg, defaultSpeed);
map.players.push(you);

let enemy = new Monster(map, new Vec2(map.width/2, map.height/2), defaultImg, defaultSpeed);
map.players.push(enemy);

//Updates the game state
function update(now, dt) {
    //TODO move to serverside 
    //change to send and receive information
    map.update(now, dt);
}

let now, dt = 0;
let last = performance.now();
const step = 1/60; // 60 tics per second

function render(dt, you) {
    //clear the map
    map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);

    //probably best to move this to update rather than render
    if (you.moved || (you.image.complete && you.mouse.changed)) {
        // if player moved send update to server
    }
    map.collisionTree.draw(map.ctx);
    map.ctx.lineWidth = "1";

    for (let projectile of map.projectiles) {
        projectile.draw();
    }
    for (let player of map.players) {
        player.draw();
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
