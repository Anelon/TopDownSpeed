import Ability from "./ability.js";
import Waterball from "./waterball.js";

export default class WaterballAbility extends Ability {
    static get NAME() { return "Waterball"; }
    static get IMAGE() { return "./img/abilities/waterball/waterball64.png"; }
    static get SPEED() { return 1000; }
    static get RANGE() { return 1000; }
    static get COOLDOWN() { return 1000; }
    static get DAMAGE() { return 1000; }

    constructor() {
        super("Waterball", WaterballAbility.IMAGE , 1000, 1000, 600, 100, Waterball);
    }

}