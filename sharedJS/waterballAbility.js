import Ability from "./ability.js";
import Waterball from "./waterball.js";
import { Circle } from "./shapes.js";
import Vec2 from "./vec2.js";

export default class WaterballAbility extends Ability {
    static get NAME() { return "Waterball"; }
    static get IMAGE() { return "./img/abilities/waterball/waterball64.png"; }
    static get SPEED() { return 1000; }
    static get RANGE() { return 1000; }
    static get COOLDOWN() { return 1000; }
    static get DAMAGE() { return 1000; }
    static hitbox = new Circle(new Vec2(), 32);
    static scale = 1;

    constructor() {
        super("Waterball", WaterballAbility.IMAGE , WaterballAbility.SPEED, WaterballAbility.RANGE, WaterballAbility.COOLDOWN, WaterballAbility.DAMAGE, Waterball, WaterballAbility.scale, WaterballAbility.hitbox);
    }

}