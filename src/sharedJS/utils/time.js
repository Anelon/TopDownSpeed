
class Time {
    /**
     * @param {import("perf_hooks").Performance} performance
     * @param {number} [now] Current time
     * @param {number} [last] When last frame ran
     * @param {number} [dt] Change in time sense last
     * @param {number} [tickRate] Ticks per second game loop runes
     */
    constructor(performance, now = performance.now(), last = 0, dt = 0, tickRate = 1/30) {
        this.now = now;
        this.last = last;
        this.dt = dt;
        this.tickRate = tickRate;
        this.performance = performance
    }
    /**
     * Updates now and dt with performance.now()
     */
    update() {
        this.now = this.performance.now();
        //calculate dt
        this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);
        //run frames while they need to run fixed timestep gameloop
        return this;
    }
}

export default Time;