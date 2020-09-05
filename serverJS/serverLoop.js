import Time from "../serverJS/serverTime.js";
import Connections from "./connections.js";
import { performance } from "perf_hooks";
import GameMap from "../sharedJS/map.js";
import { TYPES } from "../sharedJS/enums.js";
import Projectile from "../sharedJS/projectile.js";
import Player from "../sharedJS/player.js";
//import { MinPriorityQueue } from '@datastructures-js/priority-queue';

class ServerLoop {
    constructor(server) {
        //basic time object to pass to funcitons
        this.time = new Time();
        this.map = new GameMap(2000, 5000);
        this.connections = new Connections(server, this.map).start();
    }

    update(time) {
        //update all projectiles
        const deleteArray = this.map.update(time, time.tickRate);
        for (const item of deleteArray) {
            if (item.type === TYPES.player) {
                //ignore
                if(/** @type {Player}*/(item).currHealth <= 0) {

                }
            } else {
                this.map.removeProjectile(/** @type {Projectile} */(item));
            }
        }

        //check if anyone is ready to think

    }

    tick() {
        this.time.update();
        while (this.time.dt > this.time.tickRate) {
            this.time.dt = this.time.dt - this.time.tickRate;
            this.update(this.time);
        }
        //sendToClients(this.time);
        setImmediate(this.tick.bind(this));
    }

    start() {
        setImmediate(this.tick.bind(this));
    }
}
export default ServerLoop;