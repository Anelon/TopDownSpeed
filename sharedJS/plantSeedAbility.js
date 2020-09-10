import Ability from "./ability.js";
import PlantSeed from "./plantSeed.js";

export default class PlantSeedAbility extends Ability {
    static get NAME() { return "Plant Seed"; }
    static get IMAGE() { return "./img/abilities/seed/seed64.png"; }
    static get SPEED() { return 1000; }
    static get RANGE() { return 1000; }
    static get COOLDOWN() { return 1000; }
    static get DAMAGE() { return 1000; }

    constructor() {
        super(PlantSeedAbility.NAME, PlantSeedAbility.IMAGE , 1000, 1000, 600, 100, PlantSeed);
    }

}