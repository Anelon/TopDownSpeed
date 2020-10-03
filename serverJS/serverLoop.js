import Time from "../sharedJS/utils/time.js";
import Connections from "./connections.js";
import { performance } from "perf_hooks";
import CollisionEngine from "../sharedJS/collisionEngine.js";
import { TYPES, CATEGORY, NUM_OBJECTIVES } from "../sharedJS/utils/enums.js";
import Player from "../sharedJS/player.js";
import CHANNELS from "../sharedJS/utils/channels.js";
import GameMap from "../sharedJS/map/gameMap.js";
import { loadMapSync } from "./serverUtils.js";
/** @typedef {import("../sharedJS/ability/projectile.js").default} Projectile */
/** @typedef {import("../sharedJS/map/victoryMonument.js").default} VictoryMonument */
/** @typedef {import("../sharedJS/map/region.js").default} Region */
//import { MinPriorityQueue } from '@datastructures-js/priority-queue';

export default class ServerLoop {
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
        //parse all of the items from the deleteArray
        for (const item of deleteArray) {
            if (item.category === CATEGORY.player) {
                //ignore
                if (/** @type {Player}*/(item).currHealth <= 0) {
                    /** @type {Player}*/(item).kill();
                    this.connections.broadcast(CHANNELS.playerMove, item.makeObject());
                }
            } else if (item.category === CATEGORY.projectile) {
                this.collisionEngine.removeProjectile(/** @type {Projectile} */(item));
            } else if (item.category === CATEGORY.region) {
                //cast item to a region
                /** @type {Region} */
                //@ts-ignore
                const region = item;
                console.log(`Player entered the ${region.name} region`);
                if(region.name === "victoryMonument") {
                    // @ts-ignore
                    if(region.objectives.size === NUM_OBJECTIVES) {
                        console.log("A Team has Won");
                        //End the game
                        for(const [laneName, lane] of this.gameMap.lanes) {
                            if(/** @type {VictoryMonument} */(lane.regions.get("victoryMonument")).objectives.size === NUM_OBJECTIVES) {
                                console.log(laneName, "Has Won");
                                this.connections.broadcast(CHANNELS.endGame, laneName);
                            }
                        }
                    }
                }
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
        this.gameMap = GameMap.makeFromJSON(mapJSON);
        const pixelDims = this.gameMap.dimentions.multiplyVec(this.gameMap.tileSize);
        this.collisionEngine = new CollisionEngine(pixelDims.x, pixelDims.y);
        this.connections = new Connections(server, this.collisionEngine, this.gameMap, this).start();
        //add map regions and statics to the collision engine
        this.collisionEngine.setRegions(this.gameMap.generateRegions());
        this.collisionEngine.setStatics(this.gameMap.generateStatic());
    }
}