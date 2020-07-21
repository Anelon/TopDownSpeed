import Map from "./map.mjs";
import Vec2 from "./vec2.mjs";
import { Moveable } from "./entity.mjs";
import Monster from "./monster.mjs";
import { Player, PlayerController } from "./player.mjs";

//figure out resizing
//https://stackoverflow.com/questions/1664785/resize-html5-canvas-to-fit-window

const defaultSpeed = 100;
const defaultImg = './img/arrow.png';


let map = new Map();

let players = [];
let monsters = [];

let you = new PlayerController(map, new Vec2(10,10), "Player1", defaultImg, defaultSpeed);
players.push(you);

let enemy = new Monster(map, new Vec2(map.width/2, map.height/2), defaultImg, defaultSpeed);
monsters.push(enemy);
const mouse = {
    x : null,
    y : null,
    changed : false,
    changeCount : 0,
}



function mouseEvent(e) {  // get the mouse coordinates relative to the canvas top left
    var bounds = map.canvas.getBoundingClientRect(); 
    mouse.x = e.pageX - bounds.left;
    mouse.y = e.pageY - bounds.top;
    mouse.cx = e.clientX - bounds.left; // to compare the difference between client and page coordinates
    mouse.cy = e.clienY - bounds.top;
    mouse.changed = true;
    mouse.changeCount += 1;
}
document.addEventListener("mousemove",mouseEvent);


function update(dt) {
    you.update(dt);

    //TODO move to serverside 
    //change to send and receive information
    for(let monster of monsters) {
        monster.update(dt);
    }
}

// only render when the DOM is ready to display the mouse position
function render(dt) {
    if(you.moved || (you.image.complete && mouse.changed)) { // only render when image ready and mouse moved
        mouse.changed = false; // flag that the mouse coords have been rendered
        map.ctx.clearRect(0, 0, map.canvas.width, map.canvas.height);
        // get mouse canvas coordinate correcting for page scroll
        let location = new Vec2(mouse.x, mouse.y);
        map.drawImageLookat(you.image, you.location, location);
        // Draw mouse at its canvas position
        map.drawCrossHair(location, "black");
        // draw mouse event client coordinates on canvas
        map.drawCrossHair(new Vec2(mouse.cx,mouse.cy),"rgba(255,100,100,0.2)");

        // draw line from you center to mouse to check alignment is perfect
        map.ctx.strokeStyle = "black";
        map.ctx.beginPath();
        map.ctx.globalAlpha = 0.2;
        map.ctx.moveTo(you.x, you.y);
        map.ctx.lineTo(location.x, location.y);
        map.ctx.stroke();
        map.ctx.globalAlpha = 1;
    }
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
