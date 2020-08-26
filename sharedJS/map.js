//this will probably change a lot when we make an actual map
import Vec2 from "./vec2.js";
import QuadTree from "./quadTree.js";
import { Rectangle } from "./shapes.js";
import Projectile from "./projectile.js";
//import { MinPriorityQueue } from '@datastructures-js/priority-queue';


class GameMap {
    /**
     * Constructs a GameMap
     * @param {number} width Width of map region
     * @param {number} height Height of map region
     */
    constructor(width, height) {//TODO: add mapdata
        this.width = width;
        this.height = height;

        //map for holding player and projectiles id -> object
        this.players = new Map();
        this.projectiles = new Map();

        this.boundry = new Rectangle(new Vec2(this.width/2, this.height/2), this.width, this.height);
        this.qTreeCapacity = 10;
        this.collisionTree = new QuadTree(this.boundry, this.qTreeCapacity);
    }

    /**
     * Adds player to the players Map
     * @param {Player} newPlayer 
     */
    addPlayer(newPlayer) {
        this.players.set(newPlayer.id, newPlayer);
    }

    /**
     * Removes player from player Map
     * @param {Player} oldPlayer 
     */
    removePlayer(oldPlayer) {
        this.players.delete(oldPlayer.id);
    }

    /**
     * Adds projectile to the projectiles Map
     * @param {Projectile} newProjectile 
     */
    addProjectile(newProjectile) {
        this.projectiles.set(newProjectile.id, newProjectile);
    }

    /**
     * Removes projectile from player Map
     * @param {Projectile} oldPlayer 
     */
    removeProjectile(oldProjectile) {
        this.projectiles.delete(oldProjectile.id);
    }

    /**
     * Updates all player's and projectiles based on the changed time and checks for colisions
     * @param {Time} time 
     */
    update(time, step) {
        //reset quadTree, might change to updating locations of each item later if we end up with too many static items
        this.collisionTree = new QuadTree(this.boundry, this.qTreeCapacity);

        //move everything and place in collision quad tree
        for (const player of this.players.values()) {
            this.collisionTree.push(player.makePoint());
            player.overlapping = false;
        }
        for (const projectile of this.projectiles.values()) {
            projectile.update(time, step, this);
            const added = this.collisionTree.push(projectile.makePoint());
            //if projectile is out of the map region delete it
            if(!added) {
                console.log("deleted", projectile);
                this.projectiles.delete(projectile.id);
            }
            projectile.overlapping = false;
        }
        //check for collisions
        for (const player of this.players.values()) {
            const playerShape = player.makeShape();
            //make shape with 2 to have it search an area double the size of the player
            const others = this.collisionTree.query(player.makeShape(2));
            for(const other of others) {
                if(other.owner === player) continue;
                if(playerShape.intersects(other.owner.makeShape(1))) {
                    player.overlapping = true;
                    other.owner.overlapping = true;
                }
            }
        }
        for (const projectile of this.projectiles.values()) {
            const projectileShape = projectile.makeShape();
            //make shape with 2 to have it search an area double the size of the projectile
            const others = this.collisionTree.query(projectile.makeShape(2));
            for(const other of others) {
                if(other.owner === projectile) continue;
                if(projectileShape.intersects(other.owner.makeShape(1))) {
                    projectile.overlapping = true;
                    other.owner.overlapping = true;
                }
            }
        }
    }
}

export default GameMap;
