import CollisionEngine from "../sharedJS/collisionEngine.js";
import Vec2 from "../sharedJS/vec2.js";
import Time from "../sharedJS/utils/time.js";
import PlayerController from "./playerController.js";
import Projectile from "../sharedJS/ability/projectile.js";
import { TYPES, CATEGORY } from "../sharedJS/utils/enums.js";
import GameMap from "../sharedJS/map/gameMap.js";
import CanvasWrapper from "./canvasWrapper.js";
import { tileSprites } from "./sprites.js";
/** @typedef {import("../sharedJS/player.js").default} Player */

export default class ClientLoop {
    /**
     * @param {PlayerController} playerController
     * @param {GameMap} gameMap
     * @param {CanvasWrapper} canvas
     * @param {Time} time
     * @param {CollisionEngine} collisionEngine
     * @param {any} [socket]
     */
    constructor(playerController, gameMap, canvas, time, collisionEngine, socket) {
        this.playerController = playerController
        //this.gameMap = gameMap;
        this.collisionEngine = collisionEngine;
        this.setGameMap(gameMap);
        this.collisionEngine.addPlayer(this.playerController);
        this.canvas = canvas;
        this.socket = socket;
        this.time = time;

        requestAnimationFrame(this.frame.bind(this));
    }
    setGameMap(gameMap) {
        this.gameMap = gameMap;
        //set new regions and statics
        this.collisionEngine.setRegions(gameMap.generateRegions());
        this.collisionEngine.setStatics(gameMap.generateStatic());
    }
    /**
     * Updates the game state
     */
    update() {
        //update the PlayerController
        this.playerController.update(this.time, this.time.tickRate, this.collisionEngine, this.canvas, this.socket);
        this.canvas.setCenter(this.playerController.location.clone());

        //run the collision engine and catch anything flagged for deleting
        const deleteArray = this.collisionEngine.update(this.time, this.time.tickRate);
        for (const item of deleteArray) {
            if (item.category === CATEGORY.player) {
                /** @type {Player} */ (item).kill();
            } else {
                this.collisionEngine.removeProjectile(/** @type {Projectile} */(item));
                this.canvas.removeDrawable(item);
            }
        }

        if (this.socket) {
            if (this.playerController.moved || this.playerController.mouse.changed) {
                // if player moved send update to server
                this.socket.emit("playerMove", this.playerController.makeObject());
            }
        }
    }

    render() {
        //TODO look into moveing this to webworker for a different thread
        //clear the collisionEngine
        this.canvas.clear();

        this.gameMap.draw(this.canvas, tileSprites);
        this.canvas.render(this.playerController);
        this.playerController.draw(this.canvas);

        requestAnimationFrame(this.frame.bind(this));
    }

    //based off of this site
    //https://codeincomplete.com/articles/javascript-game-foundations-the-game-loop/
    frame() {
        this.time.update();
        //run frames while they need to run fixed timestep gameloop
        while (this.time.dt > this.time.tickRate) {
            this.time.dt -= this.time.tickRate;
            this.update();
        }
        this.render();
        this.time.last = this.time.now;
    }
}
