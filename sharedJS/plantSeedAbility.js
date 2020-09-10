import Ability from "./ability.js";
import PlantSeed from "./plantSeed.js";
import { Circle } from "./shapes.js";
import Vec2 from "./vec2.js";

export default class PlantSeedAbility extends Ability {
    static get NAME() { return "Plant Seed"; }
    static get IMAGE() { return "./img/abilities/seed/seed64.png"; }
    static get SPEED() { return 1000; }
    static get RANGE() { return 1000; }
    static get COOLDOWN() { return 1000; }
    static get DAMAGE() { return 1000; }
    static hitbox = new Circle(new Vec2(), 32);
    static scale = 1;

    constructor() {
        super(PlantSeedAbility.NAME, PlantSeedAbility.IMAGE , PlantSeedAbility.SPEED, PlantSeedAbility.RANGE, PlantSeedAbility.COOLDOWN, PlantSeedAbility.DAMAGE, PlantSeed, PlantSeedAbility.scale, PlantSeedAbility.hitbox);
    }

}