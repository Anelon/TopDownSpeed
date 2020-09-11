//initial directions
const DIRBITS = {
    right: 1,
    left: 2,
    up: 4,
    down: 8,
    downAndRight: 16,
    downAndLeft: 32,
    upAndRight: 64,
    upAndLeft: 128,
}
//all of the other ones
DIRBITS.downRight = DIRBITS.down | DIRBITS.right | DIRBITS.downAndRight;
DIRBITS.downLeft = DIRBITS.down | DIRBITS.left | DIRBITS.downAndLeft;
DIRBITS.upRight = DIRBITS.up | DIRBITS.right | DIRBITS.upAndRight;
DIRBITS.upLeft = DIRBITS.up | DIRBITS.left | DIRBITS.upAndLeft;
DIRBITS.upRightDown = DIRBITS.up | DIRBITS.right | DIRBITS.down | DIRBITS.upAndRight | DIRBITS.downAndRight;
DIRBITS.upLeftDown = DIRBITS.up | DIRBITS.left | DIRBITS.down | DIRBITS.upAndLeft | DIRBITS.downAndLeft;
DIRBITS.rightUpLeft = DIRBITS.right | DIRBITS.up | DIRBITS.left | DIRBITS.upAndRight | DIRBITS.upAndLeft;
DIRBITS.rightDownLeft = DIRBITS.right | DIRBITS.down | DIRBITS.left | DIRBITS.downAndLeft | DIRBITS.downAndRight;
DIRBITS.allRound = DIRBITS.up | DIRBITS.down | DIRBITS.left | DIRBITS.right | DIRBITS.downAndLeft | DIRBITS.downAndRight | DIRBITS.upAndRight | DIRBITS.upAndLeft;
Object.freeze(DIRBITS);

//array of objects that have an x, y and a direction attached to them
const DIRS = [
    { x: 1, y: 0, dir: DIRBITS.right },
    { x: -1, y: 0, dir: DIRBITS.left },
    { x: 0, y: -1, dir: DIRBITS.up }, 
    { x: 0, y: 1, dir: DIRBITS.down },
    { x: 1, y: 1, dir: DIRBITS.downAndRight },
    { x: -1, y: 1, dir: DIRBITS.downAndLeft },
    { x: 1, y: -1, dir: DIRBITS.upAndRight },
    { x: -1, y: -1, dir: DIRBITS.upAndLeft }
];
Object.freeze(DIRS);

export { DIRS, DIRBITS }
