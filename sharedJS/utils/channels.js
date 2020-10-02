const CHANNELS = {
    newPlayer: "newPlayer",
    playerMove: "playerMove",
    newProjectile: "newProjectile",
    deletePlayer: "deletePlayer",
    gameData: "gameData",
    ready: "ready",
    startGame: "startGame",
}
//lock the enum
Object.freeze(CHANNELS);

export default CHANNELS;