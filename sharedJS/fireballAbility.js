import Ability from "./ability.js";
import Fireball from "./fireball.js";
import { Circle } from "./shapes.js";
import Vec2 from "./vec2.js";

export default class FireballAbility extends Ability {
    static get NAME() { return "Fireball"; }
    static get IMAGE() { return "./img/abilities/fireball/fireball.png"; }
    static get SPEED() { return 1000; }
    static get RANGE() { return 1000; }
    static get COOLDOWN() { return 1000; }
    static get DAMAGE() { return 1000; }
    static hitbox = new Circle(new Vec2(), 32);
    static scale = 1;

    constructor() {
        super("Fireball", FireballAbility.IMAGE , FireballAbility.SPEED, FireballAbility.RANGE, FireballAbility.COOLDOWN, FireballAbility.DAMAGE, Fireball, FireballAbility.scale, FireballAbility.hitbox);
    }
}