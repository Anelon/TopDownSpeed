import Projectile from "./projectile.js";
import Vec2 from "./vec2.js";

class Ability {
    /**
     * 
     * @param {string} abilityName 
     * @param {string} abilityImgSrc 
     * @param {number} speed 
     * @param {number} range 
     * @param {number} cooldownTime 
     * @param {number} damage 
     */
    constructor(abilityName, abilityImgSrc, speed, range, cooldownTime, damage=10) {
        this.abilityName = abilityName;
        this.abilityImgSrc = abilityImgSrc;
        this.cooldownTime = cooldownTime;
        this.nextAvailable = 0;
        this.speed = speed;
        this.range = range;
        this.damage = damage;
    }
    //now is the current time
    /**
     * Attempts to use the ability
     * @param {number} now Current time
     * @param {Vec2} origin Starting location of projecile
     * @param {Vec2} look Direction projectile is aimed
     * @param {number} offset How far from origin to spawn the ability
     * @returns {Projectile|null} Spawned projectile if it was avaialable
     */
    use(now, origin, look, offset) {
        if(now >= this.nextAvailable) {
            //make projectile
            const location = origin.clone().addS(look.getUnit().multiplyScalarS(offset))
            const abilityProjectile = new Projectile(location, this.abilityName, this.abilityImgSrc, this.speed, look.clone(), this.range, this.damage);
            //console.log("Spawned: ", abilityProjectile);

            //set the cooldown
            this.nextAvailable = now + this.cooldownTime;

            //return projectile
            return abilityProjectile;
        }
    }
}

export default Ability;