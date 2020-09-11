import Ability from "./ability.js";
import Fireball from "./fireball.js";
import { Circle } from "./shapes.js";
import Vec2 from "./vec2.js";

export default class FireballAbility extends Ability {
    static get NAME() { return "Fireball"; }
    static get SPEED() { return 400; }
    static get RANGE() { return 1000; }
    static get COOLDOWN() { return 500; }
    static get DAMAGE() { return 100; }
    static hitbox = new Circle(new Vec2(), 16);
    static scale = 1;

    constructor() {
        super("Fireball", FireballAbility.SPEED, FireballAbility.RANGE, FireballAbility.COOLDOWN, FireballAbility.DAMAGE, Fireball, FireballAbility.scale, FireballAbility.hitbox);
    }
}