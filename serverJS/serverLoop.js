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
/** @typedef {import("../sharedJS/dragon.js").default} Dragon */

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
        this.running = false;
    }

    update() {
        //update all projectiles
        const deleteArray = this.collisionEngine.update(this.time, this.time.tickRate);
        //parse all of the items from the deleteArray
        for (const item of deleteArray) {
            if (item.category === CATEGORY.player) {
                const player = /** @type {Player} */(item);
                //ignore
                if (player.currHealth <= 0) {
                    player.kill();
                    this.connections.message(player.id, CHANNELS.kill, "kill");
                }
                this.connections.broadcast(CHANNELS.playerMove, player.makeObject());
            } else if (item.category === CATEGORY.projectile) {
                this.collisionEngine.removeDynamic(/** @type {Projectile} */(item));
                this.connections.broadcast(CHANNELS.deleteProjectile, item.id);
            } else if (item.category === CATEGORY.region) {
                //cast item to a region
                /** @type {Region} */
                //@ts-ignore
                const region = item;
                console.info(`Player entered the ${region.name} region`);
                if(region.name === "victoryMonument") {
                    // @ts-ignore
                    if(region.objectives.size === NUM_OBJECTIVES) {
                        //find which team won
                        for(const [laneName, lane] of this.gameMap.lanes) {
                            if(/** @type {VictoryMonument} */(lane.regions.get("victoryMonument")).objectives.size === NUM_OBJECTIVES) {
                                console.info(laneName, "Has Won");
                                this.connections.broadcast(CHANNELS.endGame, laneName);
                                this.stop();
                                break;
                            }
                        }
                    }
                }
            } else if (item.category === CATEGORY.dragon) {
                /** @type {Dragon} */(item).deleteCall = this.remove.bind(this);
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
        if (this.running)
            setImmediate(this.tick.bind(this));
    }

    start() {
        this.running = true;
        setImmediate(this.tick.bind(this));
    }
    stop() {
        this.running = false;
    }

    /**
     * @param {Dragon|Projectile} item
     */
    remove(item) {
        this.collisionEngine.removeDynamic(item);
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
        const dynamics = this.gameMap.getDynamics();
        for(const dynamic of dynamics) {
            this.collisionEngine.addDynamic(dynamic);
        }
    }
}