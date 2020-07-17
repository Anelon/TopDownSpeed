const keyBinds = {
    "w": false, //up
    "a": false, //left
    "s": false, //down
    "d": false, //right

    //non momvement might get moved to just key press
    " ": false, //interact not sure yet
    "shift": false, //dodge
    "q": false, //ability1
    "e": false, //ability2
    "r": false, //ult?
}
function keyDown(e) {
    keyBinds[e.key] = true;
    console.log(keyBinds);
}
document.addEventListener("keydown",keyDown);
function keyUp(e) {
    keyBinds[e.key] = false;
    console.log(keyBinds);
}
document.addEventListener("keyup",keyUp);
