//left click is button 0, middle is 1, right is 2
const keyBinds = {
    UP: "w", DOWN: "s", LEFT: "a", RIGHT: "d",
    ABILITY1: "q", ABILITY2: "e", ABILITY3: "r",
}
const LEFT_STR = "leftC", MIDDLE_STR = "middleC", RIGHT_STR = "rightC";
const LEFT = 0, MIDDLE = 1, RIGHT = 2;

const keyPress = {
    [keyBinds.UP]: false, //up
    [keyBinds.LEFT]: false, //left
    [keyBinds.DOWN]: false, //down
    [keyBinds.RIGHT]: false, //right

    //non momvement might get moved to just key press
    " ": false, //dodge
    "shift": false, //not sure if use
    [keyBinds.ABILITY1]: false, //ability1
    [keyBinds.ABILITY2]: false, //ability2
    [keyBinds.ABILITY3]: false, //ult?
    [LEFT_STR]: false, //melee
    [RIGHT_STR]: false, //ranged charge
}

//keyboard inputs (add to keybinds to expand)
function keyDown(e) {
    keyPress[e.key] = true;
}
document.addEventListener("keydown",keyDown);

function keyUp(e) {
    keyPress[e.key] = false;
}
document.addEventListener("keyup",keyUp);

function mousePress(button, pressed) {
    switch(button) {
        case LEFT:
            keyPress[LEFT_STR] = pressed;
            break;
        case RIGHT:
            keyPress[RIGHT_STR] = pressed;
            break;
        default:
            console.log("nothing happened");
    }
}
//set which mouse button was pressed
function mouseDown(e) {
    mousePress(e.button, true);
}
document.addEventListener("mousedown",mouseDown);

//set which mouse button was released
function mouseUp(e) {
    mousePress(e.button, false);
}
document.addEventListener("mouseup",mouseUp);

//disable context menu on page
document.getElementById("game").addEventListener('contextmenu', function (e) {
    e.preventDefault();
}, false);