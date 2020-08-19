import { performance } from "perf_hooks";

class Time {
    constructor(now = performance.now(), last = 0, dt = 0, tickRate = 1/30) {
        this.now = now;
        this.last = last;
        this.dt = dt;
        this.tickRate = tickRate;
    }
    update() {
        this.now = performance.now();
        //calculate dt
        this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);
        //run frames while they need to run fixed timestep gameloop
        return this;
    }
}

export default Time;