const CHANNELS = {
    newPlayer: "newPlayer",
    playerMove: "playerMove",
    newProjectile: "newProjectile",
    deletePlayer: "deletePlayer",
    gameData: "gameData",
    ready: "ready",
    startGame: "startGame",
    endGame: "endGame",
}
//lock the enum
Object.freeze(CHANNELS);

export default CHANNELS;