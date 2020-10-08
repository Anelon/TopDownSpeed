import CollisionEngine from "../sharedJS/collisionEngine.js";
import Time from "../sharedJS/utils/time.js";
import PlayerController from "./playerController.js";
import Projectile from "../sharedJS/ability/projectile.js";
import { TYPES, CATEGORY, NUM_OBJECTIVES } from "../sharedJS/utils/enums.js";
import GameMap from "../sharedJS/map/gameMap.js";
import CanvasWrapper from "./canvasWrapper.js";
import { tileSprites } from "./sprites.js";
import CHANNELS from "../sharedJS/utils/channels.js";
import Region from "../sharedJS/map/region.js";
/** @typedef {import("../sharedJS/player.js").default} Player */
/** @typedef {import("../sharedJS/dragon.js").default} Dragon */
/** @typedef {import("../sharedJS/entity.js").default} Entity */

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
        this.collisionEngine.addPlayer(this.playerController);
        this.canvas = canvas;
        this.socket = socket;
        this.time = time;
        this.running = false;
        this.setGameMap(gameMap);

        requestAnimationFrame(this.frame.bind(this));
    }
    start() {
        this.running = true;
        this.playerController.stunned = false;
        requestAnimationFrame(this.frame.bind(this));
    }
    stop() {
        this.running = false;
        this.playerController.stunned = true;
    }

    setGameMap(gameMap) {
        this.gameMap = gameMap;
        //set new regions and statics
        this.collisionEngine.setRegions(gameMap.generateRegions());
        this.collisionEngine.setStatics(gameMap.generateStatic());
        const dynamics = gameMap.getDynamics();
        console.log(dynamics);
        for(const dynamic of dynamics) {
            this.collisionEngine.addDynamic(dynamic);
            this.canvas.addDrawable(dynamic);
            console.log(this.canvas.drawables);
        }
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
                if (item.currHealth <= 0) {
                    /** @type {Player} */ (item).kill();
                }
                if(this.socket) this.socket.emit(CHANNELS.playerMove, item.makeObject());
            } else if (item.category === CATEGORY.projectile) {
                this.remove(/** @type {Projectile} */(item));
            } else if (item.category === CATEGORY.region) {
                console.log(item);
                /** @type {Region} */
                //@ts-ignore
                const region = item;
                if(region.name === "victoryMonument") {
                    // @ts-ignore
                    if(region.objectives.size === NUM_OBJECTIVES) {
                        console.log("A Team has Won");
                    }
                }
            } else if (item.category === CATEGORY.dragon) {
                //Set up dragon delete call back
                /** @type {Dragon} */(item).deleteCall = this.remove.bind(this);
            }
        }

        //if connected to a server send the player movement updates
        if (this.socket) {
            this.socket.emit(CHANNELS.playerMove, this.playerController.makeObject());
        }
    }

    render() {
        //TODO look into moveing this to webworker for a different thread
        //https://developers.google.com/web/updates/2018/08/offscreen-canvas
        //https://yashints.dev/blog/2019/05/11/offscreen-canvas
        this.canvas.clear();

        this.gameMap.draw(this.canvas, tileSprites);
        this.canvas.render(this.playerController);
        this.playerController.draw(this.canvas);
    }

    /**
     * @param {Dragon|Projectile} item
     */
    remove(item) {
        this.collisionEngine.removeDynamic(item);
        this.canvas.removeDrawable(item);
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
        if (this.running)
            requestAnimationFrame(this.frame.bind(this));
    }
}
