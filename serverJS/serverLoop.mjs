import Time from "../serverJS/serverTime.mjs";
import Connections from "./connections.mjs";
import { performance } from "perf_hooks";
//import { MinPriorityQueue } from '@datastructures-js/priority-queue';

class ServerLoop {
    constructor(server) {
        //basic time object to pass to funcitons
        this.time = new Time(performance);
        this.connections = new Connections(server).start();
    }

    update(time) {
        //update all projectiles

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