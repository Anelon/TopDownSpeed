import Projectile from "./projectile.mjs";

class Ability {
    constructor(abilityName, abilityImgSrc, speed, range, cooldownTime) {
        this.abilityName = abilityName;
        this.abilityImgSrc = abilityImgSrc;
        this.cooldownTime = cooldownTime;
        this.nextAvailable = 0;
        this.speed = speed;
        this.range = range;
    }
    //now is the current time
    use(now, map, origin, look) {
        console.log(now, this.nextAvailable);
        if(now >= this.nextAvailable) {
            //make projectile
            let abilityProjectile = new Projectile(map, origin.clone(), this.abilityName, this.abilityImgSrc, this.speed, look.clone(), this.range);

            //set the cooldown
            this.nextAvailable = now + this.cooldownTime;

            //return projectile
            return abilityProjectile;
        }
    }
}

export default Ability;