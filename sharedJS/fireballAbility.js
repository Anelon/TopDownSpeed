import Ability from "./ability.js";
import Fireball from "./fireball.js";

export default class FireballAbility extends Ability {
    static get NAME() { return "Fireball"; }
    static get IMAGE() { return "./img/abilities/fireball/fireball.png"; }
    static get SPEED() { return 1000; }
    static get RANGE() { return 1000; }
    static get COOLDOWN() { return 1000; }
    static get DAMAGE() { return 1000; }

    constructor() {
        super("Fireball", FireballAbility.IMAGE , 1000, 1000, 600, 100, Fireball);
    }

}