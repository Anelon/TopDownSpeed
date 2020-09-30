import Time from "../sharedJS/utils/time.js";
import Connections from "./connections.js";
import { performance } from "perf_hooks";
import CollisionEngine from "../sharedJS/collisionEngine.js";
import { TYPES, CATEGORY } from "../sharedJS/utils/enums.js";
/** @typedef {import("../sharedJS/ability/projectile.js").default} Projectile */
import Player from "../sharedJS/player.js";
import CHANNELS from "../sharedJS/utils/channels.js";
//import { MinPriorityQueue } from '@datastructures-js/priority-queue';

class ServerLoop {
    /**
     * @param {import("http").Server | import("https").Server} server
     * @param {import("../sharedJS/map/gameMap.js").default} gameMap
     */
    constructor(server, gameMap) {
        //basic time object to pass to funcitons
        this.time = new Time(performance);
        this.collisionEngine = new CollisionEngine(2000, 5000);
        this.connections = new Connections(server, this.collisionEngine).start();
        this.gameMap = gameMap;
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
        //sendToClients(this.time);
        setImmediate(this.tick.bind(this));
    }

    start() {
        setImmediate(this.tick.bind(this));
    }
}
export default ServerLoop;