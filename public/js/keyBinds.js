const LEFT = 0, MIDDLE = 1, RIGHT = 2;
const LEFT_STR = "leftC", MIDDLE_STR = "middleC", RIGHT_STR = "rightC";

const keyBinds = {
    "w": false, //up
    "a": false, //left
    "s": false, //down
    "d": false, //right

    //non momvement might get moved to just key press
    " ": false, //dodge
    "shift": false, //not sure if use
    "q": false, //ability1
    "e": false, //ability2
    "r": false, //ult?
    [LEFT_STR]: false, //melee
    [RIGHT_STR]: false, //ranged charge
}
function keyDown(e) {
    keyBinds[e.key] = true;
}
document.addEventListener("keydown",keyDown);

function keyUp(e) {
    keyBinds[e.key] = false;
}
document.addEventListener("keyup",keyUp);

//left click is button 0, middle is 1, right is 2
function mouseDown(e) {
    switch(e.button) {
        case LEFT:
            keyBinds[LEFT_STR] = true;
            break;
        case RIGHT:
            keyBinds[RIGHT_STR] = true;
            break;
        default:
            console.log("nothing happened");
    }
}
document.addEventListener("mousedown",mouseDown);

function mouseUp(e) {
    switch(e.button) {
        case LEFT:
            keyBinds[LEFT_STR] = false;
        case RIGHT:
            keyBinds[RIGHT_STR] = false;
    }
}
document.addEventListener("mouseup",mouseUp);

//disable context menu on page
document.getElementById("game").addEventListener('contextmenu', function (e) {
    e.preventDefault();
}, false);