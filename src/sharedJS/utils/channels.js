const CHANNELS = {
    newPlayer: "newPlayer",
    playerMove: "playerMove",
    newProjectile: "newProjectile",
    deletePlayer: "deletePlayer",
    deleteProjectile: "deleteProjectile",
    gameData: "gameData",
    ready: "ready",
    startGame: "startGame",
    endGame: "endGame",
    kill: "kill",
    vmUpdate: "vmUpdate",
}
//lock the enum
Object.freeze(CHANNELS);

export default CHANNELS;