import Ability from "./ability.js";
import PlantSeed from "./plantSeed.js";
import { Circle } from "./shapes.js";
import Vec2 from "./vec2.js";

export default class PlantSeedAbility extends Ability {
    static get NAME() { return "Plant Seed"; }
    static get SPEED() { return 100; }
    static get RANGE() { return 1000; }
    static get COOLDOWN() { return 500; }
    static get DAMAGE() { return 100; }
    static hitbox = new Circle(new Vec2(), 16);
    static scale = 1;

    constructor() {
        super(PlantSeedAbility.NAME, PlantSeedAbility.SPEED, PlantSeedAbility.RANGE, PlantSeedAbility.COOLDOWN, PlantSeedAbility.DAMAGE, PlantSeed, PlantSeedAbility.scale, PlantSeedAbility.hitbox);
    }

}