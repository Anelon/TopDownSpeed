import { performance } from "perf_hooks";

class Time {
    /**
     * 
     * @param {number} [now=preformance.now()] Current time
     * @param {number} [last=0] When last frame ran
     * @param {number} [dt=0] Change in time sense last
     * @param {number} [tickRate=1/30] Ticks per second game loop runes
     */
    constructor(now = performance.now(), last = 0, dt = 0, tickRate = 1/30) {
        this.now = now;
        this.last = last;
        this.dt = dt;
        this.tickRate = tickRate;
    }
    /**
     * Updates now and dt with performance.now()
     */
    update() {
        this.now = performance.now();
        //calculate dt
        this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);
        //run frames while they need to run fixed timestep gameloop
        return this;
    }
}

export default Time;