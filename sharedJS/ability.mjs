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
    use(now, origin, look) {
        if(now >= this.nextAvailable) {
            //make projectile
            let abilityProjectile = new Projectile(origin.clone(), this.abilityName, this.abilityImgSrc, this.speed, look.clone(), this.range);
            console.log("Spawned: ", abilityProjectile);

            //set the cooldown
            this.nextAvailable = now + this.cooldownTime;

            //return projectile
            return abilityProjectile;
        }
    }
}

export default Ability;