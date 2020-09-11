import Time from "../serverJS/serverTime.js";
import Connections from "./connections.js";
import { performance } from "perf_hooks";
import CollisionEngine from "../sharedJS/collisionEngine.js";
import { TYPES, CATEGORY } from "../sharedJS/enums.js";
import Projectile from "../sharedJS/projectile.js";
import Player from "../sharedJS/player.js";
//import { MinPriorityQueue } from '@datastructures-js/priority-queue';

class ServerLoop {
    constructor(server) {
        //basic time object to pass to funcitons
        this.time = new Time();
        this.collisionEngine = new CollisionEngine(2000, 5000);
        this.connections = new Connections(server, this.collisionEngine).start();
    }

    update() {
        //update all projectiles
        const deleteArray = this.collisionEngine.update(this.time, this.time.tickRate);
        for (const item of deleteArray) {
            if (item.category === CATEGORY.player) {
                //ignore
                if(/** @type {Player}*/(item).currHealth <= 0) {

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
            this.time.dt = this.time.dt - this.time.tickRate;
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