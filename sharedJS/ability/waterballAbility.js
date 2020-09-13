import Ability from "./ability.js";
import Waterball from "./waterball.js";
import { Circle } from "../shapes.js";
import Vec2 from "../vec2.js";

export default class WaterballAbility extends Ability {
    static get NAME() { return "Waterball"; }
    static get SPEED() { return 200; }
    static get RANGE() { return 1000; }
    static get COOLDOWN() { return 1000; }
    static get DAMAGE() { return 1000; }
    static HITBOX = new Circle(new Vec2(), 16);
    static SCALE = 1;

    constructor() {
        super("Waterball", WaterballAbility.SPEED, WaterballAbility.RANGE, WaterballAbility.COOLDOWN, WaterballAbility.DAMAGE, Waterball, WaterballAbility.SCALE, WaterballAbility.HITBOX);
    }

}