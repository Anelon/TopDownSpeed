import Projectile from "./projectile.js";
import Vec2 from "./vec2.js";
import Player from "./player.js";
import PlayerController from "../clientJS/playerController.js";
import { Circle } from "./shapes.js";

class Ability {
    /**
     * @param {string} abilityName
     * @param {string} abilityImgSrc
     * @param {number} speed
     * @param {number} range
     * @param {number} cooldownTime
     * @param {number} damage
     * @param {typeof Projectile} projectileConstructor
     * @param {number} projectileScale
     * @param {Circle} projectileHitbox
     */
    constructor(abilityName, abilityImgSrc, speed, range, cooldownTime, damage, projectileConstructor, projectileScale, projectileHitbox) {
        this.abilityName = abilityName;
        this.abilityImgSrc = abilityImgSrc;
        this.cooldownTime = cooldownTime;
        this.nextAvailable = 0;
        this.speed = speed;
        this.range = range;
        this.damage = damage;
        this.projectileConstructor = projectileConstructor;
        this.projectileScale = projectileScale;
        this.projectileHitbox = projectileHitbox;
    }
    //now is the current time
    /**
     * Attempts to use the ability
     * @param {number} now Current time
     * @param {PlayerController} owner How far from origin to spawn the ability
     * @returns {Projectile|null} Spawned projectile if it was avaialable
     */
    use(now, owner) {
        if(now >= this.nextAvailable) {
            const offset = owner.hitbox.width + this.projectileHitbox.width;
            //make projectile
            const location = owner.location.clone().addS(owner.look.getUnit().multiplyScalarS(offset));
            const abilityProjectile = new this.projectileConstructor(
                location, this.abilityName, this.abilityImgSrc, this.speed, this.projectileScale, owner.look.clone(), this.range, this.damage, this.projectileHitbox, owner
            );
            //console.log("Spawned: ", abilityProjectile);

            //set the cooldown
            this.nextAvailable = now + this.cooldownTime;

            //return projectile
            return abilityProjectile;
        }
    }
}

export default Ability;