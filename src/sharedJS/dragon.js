import Vec2 from "./vec2.js";
import Entity from "./entity.js";
import { Circle, Rectangle } from "./shapes.js";
import { TYPES, CATEGORY } from "./utils/enums.js";
import Projectile from "./ability/projectile.js";
import { keyFrames, animations, animationLengths } from "./dragonData.js";
import Box from "./box.js";
import Fireball from "./ability/fireball.js";
import FireballAbility from "./ability/fireballAbility.js";
/** @typedef {import("./map/region.js").default} Region */
/** @typedef {import("./collisionEngine.js").default} CollisionEngine */

/**
 * Class for the dragon boss
 * @extends Entity
 */
export default class Dragon extends Entity {
    static get SPEED() {return 0;}
    static get SCALE() {return 1;}
    static get WIDTH() {return 16;}
    static get HEALTH() {return 2000;}
    static get SIZE() {return new Vec2(400, 300);}
    static get BoxSIZE() {return new Vec2(300, 300);}
    static spritePath = "/img/dragon/";
    static phaseSpeed = 2;
    /**
     * @param {Vec2} location 
     * @param {string} name 
     * @param {Region} guardedRegion 
     * @param {Vec2} look 
     */
    constructor(location, name, guardedRegion, look) {
        let newHitbox = new Rectangle(location, Dragon.SIZE.x, Dragon.SIZE.y);
        super(location, Dragon.spritePath, newHitbox, Dragon.SPEED, Dragon.SCALE, look);
        this.name = name;
        this.maxHealth = Dragon.HEALTH;
        this.currHealth = Dragon.HEALTH;

        this.type = TYPES.fire;
        this.category = CATEGORY.dragon;
        this.guardedRegion = guardedRegion;
        //lock the region
        if(guardedRegion) this.guardedRegion.locked = true;
        this.active = false;
        this.phase = animations.idleBattle;
        this.frame = 0;
        this.deleteCall = null;

        this.targetPlayers = new Set();
        this.attackOrigin = this.location.sub(new Vec2(0,0));
    }

    setTargetPlayers(targetPlayers) {
        this.targetPlayers = targetPlayers;
    }
    
    /**
     * Updates where the player is based on the json data given
     * @param {Dragon} json 
     * @returns reference to this
     */
    // @ts-ignore
    updateInfo(json) {
        if (json.currHealth)
            this.currHealth = json.currHealth;
        if (json.maxHealth)
            this.maxHealth = json.maxHealth;
        //call entity's updateFromJSON
        return this;
    }

    kill() {
        if(this.guardedRegion) this.guardedRegion.locked = false;
        this.category = CATEGORY.none;
    }

    /**
     * @param {CollisionEngine} [collisionEngine]
    */
    attack(collisionEngine) {
        for (const player of this.targetPlayers.values()) {
            console.log(player.name);
            const fireball = new Fireball(this.attackOrigin, "fireBall", 200, 1, player.location.sub(this.attackOrigin), 500, 150, FireballAbility.hitbox, this.id);
            collisionEngine.addDynamic(fireball);
        }
    }

    /**
     * 
     * @param {Dragon|Projectile|Entity} other 
     */
    hit(other) {
        if (this.phase === animations.death) return false;
        if(other.category === CATEGORY.projectile) {
            if(this.currHealth - other.damage <= 0) {
                this.frame = 0;
                this.phase = animations.death;
                return true;
            }
        }
        return false;
    }
    /**
     * @param {import("./utils/time.js").default} time
     * @param {number} dt
     * @param {CollisionEngine} [collisionEngine]
     */
    update(time, dt, collisionEngine) {
        this.frame += Dragon.phaseSpeed;
        if(animationLengths.get(this.phase) <= this.frame) {
            this.frame = 0;
            if (this.active) {
                //think
                this.phase = animations.attack2;
            } else {
                //reset to idle
                this.phase = animations.idleBattle;
            }
        }
        if (keyFrames.has(`${this.phase}_${this.frame}`)) {
            const action = keyFrames.get(`${this.phase}_${this.frame}`);
            if(action === "melee") {
                //TODO melee attack
            } else if(action === "fireball") {
                //TODO Launch fireball
                this.attack(collisionEngine);
            } else if(action === "kill") {
                this.kill();
            } else if(action === "delete") {
                this.deleteCall(this);
            }
        }
    }

    /**
     * Makes a point and assigns Entity as owner
     * @returns {Box}
     */
    makePoint() {
        return new Box(this.location, Dragon.BoxSIZE, this);
    }

    /**
     * Creates a cirlce based on the size and location of Entity
     * @param {number} [scale=1] The scale of the shape you want to make
     * @returns {Rectangle}
     */
    // @ts-ignore
    makeShape(scale = 1) {
        return new Rectangle(this.location, (Dragon.BoxSIZE.x) * scale, this.hitbox.height * scale);
    }
}
