const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
const borderSize = 40;
canvas.width = width - borderSize;
canvas.height = height - borderSize;
canvas.style = "position:absolute; left: 50%; top: 50%; transform: translate(-50%,-50%)";
canvas.style.backgroundColor = "white";

//figure out resizing
//https://stackoverflow.com/questions/1664785/resize-html5-canvas-to-fit-window
document.body.appendChild(canvas);
let renderSaveCount = 0; // Counts the number of mouse events that we did not have to render the whole scene

let idGen = 0;
class Entity {
    constructor(location, imgSrc) {
        if(!(location instanceof Vec2)) {
            throw TypeError("Entity: Location not Vec2");
        }
        this.id = idGen++;
        this.location = location;
        this.image = new Image();
        this.image.src = imgSrc;
    }
    get x() {
        return this.location.x;
    }
    get y() {
        return this.location.y;
    }
}
class Moveable extends Entity {
    constructor(location,imgSrc, speed) {
        super(location,imgSrc);
        this.speed = speed;
        this.moved = true; //true so it hopefully gets drawn frame it spawns
        this.lookDirection = new Vec2(1,0);
    }
    update(dt) {
        this.move(dt, this.lookDirection);
    }
    move(dt, direction) {
        if(!(direction instanceof Vec2)) {
            throw TypeError("Moveable move: Direction not Vec2");
        }
        let oldLocation = this.location.clone();

        let dist = this.speed * dt;
        this.location.addS(direction.getUnit().multiplyScalar(dist));
        if(this.location.x < 0 || this.location.x >= canvas.width) {
            this.location.x = oldLocation.x;
        }
        if(this.location.y < 0 || this.location.y >= canvas.height) {
            this.location.y = oldLocation.y;
        }
    }
}
const defaultSpeed = 100;
const defaultImg = './img/arrow.png';

class Monster extends Moveable {
    constructor(location, imgSrc = defaultImg, speed = defaultSpeed) {
        super(location, imgSrc, speed);
    }
    update(dt) {
        for(let player in players) {

        }
    }
}
//refactor to player class
class Player extends Moveable {
    constructor(location) {
        super(location, './img/arrow.png', 100);
    }
    update(dt) {
        //TODO figure out how to move other players (probably just set their x and y)
    }
}
class PlayerController extends Player {
    constructor(location) {
        super(location, './img/arrow.png', 100);
    }
    update(dt) {
        this.moved = false;
        let direction = new Vec2();
        //check all of the different movement keybindings
        if(keyBinds.w) {
            direction.y -= 1;
        }
        if(keyBinds.s) {
            direction.y += 1;
        }
        if(keyBinds.a) {
            direction.x -= 1;
        }
        if(keyBinds.d) {
            direction.x += 1;
        }
        if(direction.x || direction.y) {
            this.move(dt, direction);
            this.moved = true;
            //this.location.addS(direction.makeUnit());
        }
    }
}

let players = [];
let monsters = [];

let you = new PlayerController(new Vec2(10,10), true);
players.push(you);

let enemy = new Monster(new Vec2(width/2, height/2));
monsters.push(enemy);
const mouse = {
    x : null,
    y : null,
    changed : false,
    changeCount : 0,
}


function drawImageLookat(img, x, y, lookx, looky, withOutline = false){
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.rotate(Math.atan2(looky - y, lookx - x)); // Adjust image 90 degree anti clockwise (PI/2) because the image  is pointing in the wrong direction.
    if(withOutline) {
        let dArr = [-1,-1, 0,-1, 1,-1, -1,0, 1,0, -1,1, 0,1, 1,1], // offset array
            s = 2,  // thickness scale
            i = 0,  // iterator
            bx = -img.width/2,  // final position
            by = -img.height/2;

        // draw images at offsets from the array scaled by s
        for(; i < dArr.length; i += 2)
            ctx.drawImage(img, bx + dArr[i]*s, by + dArr[i+1]*s);

        // fill with color
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = "red";
        ctx.fillRect(-img.width/2 - s,-img.height/2 - s,img.width + 2 * s, img.height + 2 * s);

        // draw original image in normal mode
        ctx.globalCompositeOperation = "source-over";
    }
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0); // restore default not needed if you use setTransform for other rendering operations
}
function drawCrossHair(x,y,color){
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x + 10, y);
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x, y + 10);
    ctx.stroke();
}

function mouseEvent(e) {  // get the mouse coordinates relative to the canvas top left
    var bounds = canvas.getBoundingClientRect(); 
    mouse.x = e.pageX - bounds.left;
    mouse.y = e.pageY - bounds.top;
    mouse.cx = e.clientX - bounds.left; // to compare the difference between client and page coordinates
    mouse.cy = e.clienY - bounds.top;
    mouse.changed = true;
    mouse.changeCount += 1;
}
document.addEventListener("mousemove",mouseEvent);
ctx.font = "18px arial";
ctx.lineWidth = 1;


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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // get mouse canvas coordinate correcting for page scroll
        let x = mouse.x - scrollX;
        let y = mouse.y - scrollY;
        drawImageLookat(you.image, you.x, you.y, x ,y);
        // Draw mouse at its canvas position
        drawCrossHair(x,y,"black");
        // draw mouse event client coordinates on canvas
        drawCrossHair(mouse.cx,mouse.cy,"rgba(255,100,100,0.2)");

        // draw line from you center to mouse to check alignment is perfect
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.globalAlpha = 0.2;
        ctx.moveTo(you.x, you.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.globalAlpha = 1;
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
