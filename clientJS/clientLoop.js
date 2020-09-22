import CollisionEngine from "../sharedJS/collisionEngine.js";
import Vec2 from "../sharedJS/vec2.js";
import Time from "../sharedJS/utils/time.js";
import PlayerController from "./playerController.js";
import Projectile from "../sharedJS/ability/projectile.js";
import { TYPES, CATEGORY } from "../sharedJS/utils/enums.js";
import GameMap from "../sharedJS/map/gameMap.js";
import CanvasWrapper from "./canvasWrapper.js";

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
        this.gameMap = gameMap;
        this.collisionEngine = collisionEngine;
        this.collisionEngine.addStatics(this.gameMap.generateStatic());
        this.collisionEngine.addPlayer(this.playerController);
        this.canvas = canvas;
        this.socket = socket;
        this.time = time;

        requestAnimationFrame(this.frame.bind(this));
    }
    //Updates the game state
    /**
     *
     * @param {Time} time 
     * @param {number} step Tick rate of server
     */
    update(time, step) {
        //update the PlayerController
        this.playerController.update(time, step, this.collisionEngine, this.canvas, this.socket);
        this.canvas.setCenter(this.playerController.location.clone());

        if (this.socket) {
            if (this.playerController.moved || this.playerController.mouse.changed) {
                // if player moved send update to server
                this.socket.emit("playerMove", this.playerController.makeObject());
            }
        }

        //run the collision engine and catch anything flagged for deleting
        const deleteArray = this.collisionEngine.update(time, step);
        for (const item of deleteArray) {
            if (item.category === CATEGORY.player) {
                //TODO respawn player (or have server respawn player)
            } else {
                console.log("Deleting", item)
                this.collisionEngine.removeProjectile(/** @type {Projectile} */(item));
                this.canvas.removeDrawable(item);
            }
        }
    }

    render() {
        //TODO look into moveing this to webworker for a different thread
        //clear the collisionEngine
        this.canvas.clear();

        this.gameMap.draw(this.canvas);
        this.canvas.render(this.playerController);
        this.playerController.draw(this.canvas);

        requestAnimationFrame(this.frame.bind(this));
    }

    //based off of this site
    //https://codeincomplete.com/articles/javascript-game-foundations-the-game-loop/
    frame() {
        this.time.update();
        //console.log(time.dt);
        //run frames while they need to run fixed timestep gameloop
        while (this.time.dt > this.time.tickRate) {
            this.time.dt -= this.time.tickRate;
            this.update(this.time, this.time.tickRate);
        }
        this.render();
        this.time.last = this.time.now;
    }
}
