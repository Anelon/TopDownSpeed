//this will probably change a lot when we make an actual map
import Vec2 from "./vec2.js";
import QuadTree from "./quadTree.js";
import { Rectangle } from "./shapes.js";
import Projectile from "./projectile.js";
import Player from "./player.js";
import CanvasWrapper from "../clientJS/canvasWrapper.js";
import Time from "../clientJS/time.js";
//import PlayerController from "../clientJS/playerController.js";
import Entity from "./entity.js";
//import { MinPriorityQueue } from '@datastructures-js/priority-queue';


export default class CollisionEngine {
    /**
     * Constructs a CollisionEngine
     * @param {number} width Width of map region
     * @param {number} height Height of map region
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;

        //map for holding player and projectiles id -> object
        this.players = new Map();
        this.projectiles = new Map();

        this.boundry = new Rectangle(new Vec2(this.width/2, this.height/2), this.width, this.height);
        this.qTreeCapacity = 10;
        this.collisionTree = new QuadTree(this.boundry, this.qTreeCapacity);
        this.staticObjects = new QuadTree(this.boundry, this.qTreeCapacity);
    }

    /**
     * Updates all player's and projectiles based on the changed time and checks for colisions
     * @param {Time} time 
     * @param {number} step The tick time
     * @param {CanvasWrapper} [canvas=null] Will be passed on clientside code
     * @returns {Array<Entity>} Objects that should be deleted
     */
    update(time, step, canvas = null) {
        //reset quadTree, might change to updating locations of each item later if we end up with too many static items
        this.collisionTree = new QuadTree(this.boundry, this.qTreeCapacity);
        const deleteList = new Array();

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
                deleteList.push(projectile);
            }
            projectile.overlapping = false;
        }
        //check for collisions
        for (const player of this.players.values()) {
            const playerShape = player.makeShape();
            const doubleShape = player.makeShape(2);
            //make shape with 2 to have it search an area double the size of the player
            const others = this.collisionTree.query(doubleShape);
            this.staticObjects.query(doubleShape, others);
            for(const other of others) {
                if(other.owner === player) continue;
                if(playerShape.intersects(other.owner.makeShape())) {
                    player.overlapping = true;
                    //should probably do something other for the players rather than deleting
                    if(player.hit(other.owner)) deleteList.push(player);
                    other.owner.overlapping = true;
                    if(other.owner.hit(player)) deleteList.push(other.owner);
                }
            }
        }
        for (const projectile of this.projectiles.values()) {
            //skip projectiles that have already done something
            if (deleteList.includes(projectile)) continue;
            const projectileShape = projectile.makeShape();
            const doubleShape = projectile.makeShape(2);
            //make shape with 2 to have it search an area double the size of the projectile
            const others = this.collisionTree.query(doubleShape);
            this.staticObjects.query(doubleShape, others);
            //check static objects as well
            this.staticObjects.query(doubleShape, others);
            for(const other of others) {
                if(other.owner === projectile) continue;
                if(projectileShape.intersects(other.owner.makeShape())) {
                    projectile.overlapping = true;
                    if(projectile.hit(other.owner)) deleteList.push(projectile);
                    other.owner.overlapping = true;
                    if(other.owner.hit(projectile)) deleteList.push(other.owner);
                }
            }
        }
        return deleteList;
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
     * @param {Player|string} oldPlayer A player object or playerID
     */
    removePlayer(oldPlayer) {
        if(oldPlayer instanceof Player) {
            this.players.delete(oldPlayer.id);
        } else {
            this.players.delete(oldPlayer);
        }
    }

    /**
     * Updates the player on the map or creates a new player
     * @param {Player} playerJSON 
     * @returns {Player|boolean}
     */
    updatePlayer(playerJSON) {
        const player = this.players.get(playerJSON.id);
        //this should not happen in production hopefully
        //console.assert(player instanceof Player, "Player not found", playerJSON.id);
        if(player instanceof Player) {
            player.updateInfo(playerJSON);
            return false;
        } else {
            //handle if the server reloads but the client doesn't (could just reset the client but this seems better for development)
            const {
                location, name, imgSrc, speed, maxHealth
            } = playerJSON;
            console.log(maxHealth);
            let newPlayer = new Player(new Vec2(location.x, location.y), name, imgSrc, speed, maxHealth);
            newPlayer.id = playerJSON.id;
            this.addPlayer(newPlayer);
            return newPlayer;
        }
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
     * @param {Projectile} oldProjectile 
     */
    removeProjectile(oldProjectile) {
        this.projectiles.delete(oldProjectile.id);
    }
}