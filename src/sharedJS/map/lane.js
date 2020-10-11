import Dragon from "../dragon.js";
import { DECORATION_NAMES, REGIONS, REGION_NAMES, TILES, TILE_NAMES, VM_DECORATION } from "../utils/enums.js";
import Vec2 from "../vec2.js";
import Layer from "./layer.js";
import PVEObjectiveRegion from "./pveObjectiveRegion.js";
import PVERegion from "./pveRegion.js";
import Region from "./region.js";
import VictoryMonument from "./victoryMonument.js";

export default class Lane {
    /**
     * @param {string} name
     * @param {Vec2} dimentions In number of tiles wide, tall
     * @param {number} numLayers
     * @param {Vec2} tileSize
     * @param {Vec2} [topLeft] Will fill with empty layers if not set
     * @param {Array<Layer>} [layers] Will fill with empty layers if not set
     * @param {Map<string, Region>} [regions]
     */
    constructor(name, dimentions, numLayers, tileSize, topLeft=new Vec2(), layers, regions) {
        this.name = name;
        this.dimentions = dimentions;
        this.tileSize = tileSize;
        this.topLeft = topLeft;
        /** @type {Array<Layer>} */
        this.layers;
        if(layers) {
            this.layers = layers;
        } else {
            this.layers = new Array(numLayers);
            this.layers[0] = new Layer(dimentions, TILES[TILE_NAMES.g]);
            for (let i = 1; i < numLayers; i++) {
                this.layers[i] = new Layer(dimentions);
            }
        }
        //set dungeons
        let center = dimentions.multiplyScalar(.5).add(topLeft).multiplyVecS(tileSize);
        this.region = new Region(center, dimentions.clone().multiplyVecS(tileSize), "Lane");

        /** @type {Map<string, Region>} */
        this.regions = new Map();
        if(regions) this.regions = regions;

        this.dynamics = new Array();
        //spawn dragon if the lane has PVE dungeon and PVE objective
        if(this.regions.get(REGION_NAMES.pve) && this.regions.get(REGION_NAMES.pveObjective)) {
            this.spawnDragon();
        }
        //if victory monument tie to vm decorations to it
        if(this.regions.get(REGION_NAMES.victoryMonument)) {
            this.attachVMDecoration();
        }
        this.players = new Map();
    }
    makeObject() {
        const dimentions = {x: this.dimentions.x, y: this.dimentions.y};
        const region = this.region;
        const regions = new Array(...(this.regions));
        const numLayers = this.layers.length;
        //Might add filter back in later
        //const layers = this.layers.filter((layer) => layer.empty).map((layer) => layer.makeObject());
        const layers = this.layers.map((layer) => layer.makeObject());

        return {dimentions, numLayers, region, regions, layers}
    }
    /**
     * @param {{ name: string; dimentions: Vec2; layers: Array<Layer>; regions: Array<Array<string|Region>>; }} json
     * @param {Vec2} tileSize
     */
    static makeFromJSON(json, tileSize) {
        const {
            name, dimentions, layers, regions
        } = json;
        const dims = new Vec2(dimentions.x, dimentions.y);
        const tilesize = new Vec2(tileSize.x, tileSize.y);
        const topleft = new Vec2(); //assume top left is at 0,0 for left lane
        const newLayers = layers.map((layer) => Layer.makeFromJSON(layer, dims));
        const newRegions = new Map(regions.map((region) => [/** @type {string} */ (region[0]), Region.makeFromJSON(region[1])]));

        return new Lane(name, dims, layers.length, tilesize, topleft, newLayers, newRegions);
    }

    /**
     * @param {boolean} vertical
     * @param {Vec2} laneTopLeft
     */
    mirror(vertical, laneTopLeft) {
        //clone the layers and mirror them
        const mirroredLayers = this.layers.map((layer) => layer.mirror(vertical));
        //find the new lane center
        let laneCenter = this.dimentions.multiplyScalar(0.5).add(laneTopLeft).multiplyVecS(this.tileSize);
        //mirror the regions
        const mirroredRegions = new Map();
        for(const region of this.regions.values()) {
            const centerToRegion = region.center.sub(this.region.center);
            if(vertical) centerToRegion.x *= -1;
            else centerToRegion.y *= -1;

            mirroredRegions.set(region.name, new REGIONS[region.name](laneCenter.add(centerToRegion), region.dimentions.clone(), region.name, region.color));
        }

        //create new mirrored lane
        return new Lane("", this.dimentions.clone(), this.layers.length, this.tileSize, laneTopLeft, mirroredLayers, mirroredRegions);
    }
    /**
     * @param {string} newName
     */
    setName(newName) {
        this.name = newName;
        this.region.setLaneName(newName);
        for(const region of this.regions.values()) {
            region.setLaneName(newName);
        }
    }
    getJSON() {
        return JSON.stringify(this);
    }
    generateStatic() {
        let statics = new Array();
        for(const layer of this.layers) {
            statics.push(...(layer.generateStatic(this.tileSize, this.topLeft)));
        }
        return statics;
    }
    generateRegions() {
        let regions = new Array(this.region);
        for(const region of this.regions.values()) {
            regions.push(region);
        }
        return regions;
    }
    getDynamics() {
        return this.dynamics;
    }
    /**
     * @param {import("../../clientJS/canvasWrapper.js").default} canvas
     * @param {import("../../clientJS/sprites.js").tileSprites} tileSprites
     * @param {import("../../clientJS/sprites.js").decorationSprites} decorationSprites
     */
    draw(canvas, tileSprites, decorationSprites) {
        //pass the draw command to the layers
        for(const layer of this.layers) {
            layer.draw(canvas, this.topLeft, tileSprites, decorationSprites);
        }
        this.region.draw(canvas);
        for(const region of this.regions.values()) {
            region.draw(canvas);
        }
    }
    /**
     * @param {Vec2} regionStart
     * @param {Vec2} regionEnd
     * @param {number} layer
     * @param {import("./tile.js").default} tile
     */
    update(regionStart, regionEnd, layer, tile) {
        this.layers[layer].update(regionStart, regionEnd, tile, this.topLeft);
    }
    /**
     * @param {Vec2} regionStart
     * @param {Vec2} regionEnd
     * @param {typeof Region} region
     * @param {string} name
     */
    addRegion(regionStart, regionEnd, region, name) {
        const dimentions = regionEnd.sub(regionStart).absS().multiplyVecS(this.tileSize).addS(this.tileSize);
        const topLeft = new Vec2(Math.min(regionStart.x, regionEnd.x), Math.min(regionStart.y, regionEnd.y))
        const center = topLeft.multiplyVec(this.tileSize).addS(dimentions.multiplyScalar(0.5));
        //update or add the region to the map
        this.regions.set(name, new region(center, dimentions, name));
    }
    addPlayer(newPlayer) {
        this.players.set(newPlayer.id, newPlayer);
    }
    spawnDragon() {
        //pull regions for simplicity
        const pve = /** @type {PVERegion} */(this.regions.get(REGION_NAMES.pve));
        const pveObjective = /** @type {PVEObjectiveRegion} */(this.regions.get(REGION_NAMES.pveObjective));
        //calcuate the shift / look directions of the dragon
        const shift = new Vec2(pve.center.x - pveObjective.center.x, 0).multiplyScalarS(.5);
        //create boss location
        const bossLocation = pve.center.sub(shift.add(new Vec2(0, -30)));
        //make the boss Dragon
        pve.bossMonster = new Dragon(bossLocation, "dragon", pveObjective, shift);
        //add the Boss monster
        this.dynamics.push(pve.bossMonster);
    }
    attachVMDecoration() {
        //pull regions for simplicity
        const vm = /** @type {VictoryMonument} */(this.regions.get(REGION_NAMES.victoryMonument));

        const decorations = new Array();
        for (const layer of this.layers) {
            for(const row of layer.tiles) {
                for (const tile of row) {
                    if(VM_DECORATION.has(tile.name)) {
                        decorations.push(tile);
                    }
                }
            }
        }
        vm.setDecoration(decorations);
        console.log(vm.decorations);
    }
}