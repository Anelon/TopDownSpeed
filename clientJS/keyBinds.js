//left click is button 0, middle is 1, right is 2
const MOUSE_STR = "mouse";
export const keyBinds = {
    UP: "w", DOWN: "s", LEFT: "a", RIGHT: "d",
    DODGE: "shift", JUMP: " ",
    ABILITY1: "q", ABILITY2: "e", ABILITY3: "f",
    ROTATE: "r",
    MELEE: MOUSE_STR+"0", RANGE: MOUSE_STR+"2", UNLOCK: MOUSE_STR+"1",
}

export const keyPress = {
    [keyBinds.UP]: false, //up
    [keyBinds.LEFT]: false, //left
    [keyBinds.DOWN]: false, //down
    [keyBinds.RIGHT]: false, //right

    //non momvement might get moved to just key press
    [keyBinds.DODGE]: false, //dodge
    [keyBinds.JUMP]: false, //not sure if use
    [keyBinds.ABILITY1]: false, //ability1
    [keyBinds.ABILITY2]: false, //ability2
    [keyBinds.ABILITY3]: false, //ult?
    [keyBinds.ROTATE]: false, //ult?
    [keyBinds.MELEE]: false, //melee
    [keyBinds.RANGE]: false, //ranged charge
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
    keyPress[MOUSE_STR + button.toString()] = pressed;
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