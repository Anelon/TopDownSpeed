import Time from "../sharedJS/utils/time.js";
import Connections from "./connections.js";
import { performance } from "perf_hooks";
import CollisionEngine from "../sharedJS/collisionEngine.js";
import { TYPES, CATEGORY } from "../sharedJS/utils/enums.js";
/** @typedef {import("../sharedJS/ability/projectile.js").default} Projectile */
import Player from "../sharedJS/player.js";
import CHANNELS from "../sharedJS/utils/channels.js";
import GameMap from "../sharedJS/map/gameMap.js";
import { loadMapSync } from "./serverUtils.js";
//import { MinPriorityQueue } from '@datastructures-js/priority-queue';

class ServerLoop {
    /**
     * @param {import("http").Server | import("https").Server} server
     */
    constructor(server) {
        //basic time object to pass to funcitons
        this.time = new Time(performance);
        this.gameMap = null;
        this.collisionEngine = null;
        this.connections = null;
        this.setup(server);
    }

    update() {
        //update all projectiles
        const deleteArray = this.collisionEngine.update(this.time, this.time.tickRate);
        for (const item of deleteArray) {
            if (item.category === CATEGORY.player) {
                //ignore
                if (/** @type {Player}*/(item).currHealth <= 0) {
                    /** @type {Player}*/(item).kill();
                    this.connections.broadcast(CHANNELS.playerMove, item.makeObject());
                }
            } else {
                this.collisionEngine.removeProjectile(/** @type {Projectile} */(item));
            }
        }
        //check if anyone is ready to think
    }

    tick() {
        this.time.update();
        while (this.time.dt > this.time.tickRate) {
            this.time.dt -= this.time.tickRate;
            this.update();
        }
        this.time.last = this.time.now;
        //sendToClients(this.time);
        setImmediate(this.tick.bind(this));
    }

    start() {
        setImmediate(this.tick.bind(this));
    }

    /**
     * @param {import("http").Server | import("https").Server} server
     */
    setup(server) {
        const mapJSON = JSON.parse(loadMapSync("map"));
        const gameMap = GameMap.makeFromJSON(mapJSON);
        const pixelDims = gameMap.dimentions.multiplyVec(gameMap.tileSize);
        this.collisionEngine = new CollisionEngine(pixelDims.x, pixelDims.y);
        this.connections = new Connections(server, this.collisionEngine, this.gameMap, this).start();
    }
}
export default ServerLoop;