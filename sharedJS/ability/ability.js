import Projectile from "./projectile.js";
import { Circle } from "../shapes.js";
import Vec2 from "../vec2.js";

class Ability {
    /**
     * @param {string} abilityName
     * @param {number} speed
     * @param {number} range
     * @param {number} cooldownTime
     * @param {number} damage
     * @param {typeof Projectile} projectileConstructor
     * @param {number} projectileScale
     * @param {Circle} projectileHitbox
     * @param {string} [abilityImgSrc]
     */
    constructor(abilityName, speed, range, cooldownTime, damage, projectileConstructor, projectileScale, projectileHitbox, abilityImgSrc) {
        this.abilityName = abilityName;
        this.cooldownTime = cooldownTime;
        this.nextAvailable = 0;
        this.speed = speed;
        this.range = range;
        this.damage = damage;
        this.projectileConstructor = projectileConstructor;
        this.projectileScale = projectileScale;
        this.projectileHitbox = projectileHitbox;
        this.abilityImgSrc = abilityImgSrc;
    }
    //now is the current time
    /**
     * Attempts to use the ability
     * @param {number} now Current time
     * @param {import("../../clientJS/playerController.js").default} owner How far from origin to spawn the ability
     * @param {Vec2} target Where the projectile will be aimed at
     * @returns {Projectile|null} Spawned projectile if it was avaialable
     */
    use(now, owner, target) {
        if(now >= this.nextAvailable) {
            const offset = owner.hitbox.width + this.projectileHitbox.width;
            //make projectile
            const location = owner.location.clone().addS(target.getUnit().multiplyScalarS(offset));
            const abilityProjectile = new this.projectileConstructor(
                location, this.abilityName, this.speed, this.projectileScale, target.clone(), this.range, this.damage, this.projectileHitbox, owner
            );

            //set the cooldown
            this.nextAvailable = now + this.cooldownTime;

            //return projectile
            return abilityProjectile;
        }
    }
}

export default Ability;