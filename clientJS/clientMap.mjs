//this will probably change a lot when we make an actual map
import Vec2 from "./vec2.mjs";
import QuadTree from "./quadTree.mjs";
import { Rectangle } from "./shapes.mjs";
//import { MinPriorityQueue } from '@datastructures-js/priority-queue';


class Map {
	constructor(width, height, canvas, socket) {
		this.width = width;
		this.height = height;
		//holder for player contollers (will probably only ever have the one)
		this.players = [];
		//holder for projectiles
		this.projectiles = [];
		this.canvas = canvas;
		this.socket = socket;

		this.boundry = new Rectangle(new Vec2(this.width / 2, this.height / 2), this.width, this.height);
		this.qTreeCapacity = 10;
		this.collisionTree = new QuadTree(this.boundry, this.qTreeCapacity);
	}

	update(time, skip) {
		//reset quadTree, might change to updating locations of each item later if we end up with too many static items
		this.collisionTree = new QuadTree(this.boundry, this.qTreeCapacity);

		//move everything and place in collision quad tree
		for (let player of this.players) {
			if (player !== skip)
				player.update(time, this, this.canvas);
			this.collisionTree.push(player.makePoint());
			player.overlapping = false;
		}
		for (let projectile of this.projectiles) {
			projectile.update(time, this, this.canvas);
			this.collisionTree.push(projectile.makePoint());
			projectile.overlapping = false;
		}
		//check for collisions
		for (let player of this.players) {
			let playerShape = player.makeShape();
			//make shape with 2 to have it search an area double the size of the player
			let others = this.collisionTree.query(player.makeShape(2));
			for (let other of others) {
				if (other.owner === player) continue;
				if (playerShape.intersects(other.owner.makeShape(1))) {
					player.overlapping = true;
					other.owner.overlapping = true;
				}
			}
		}
		for (let projectile of this.projectiles) {
			let projectileShape = projectile.makeShape();
			//make shape with 2 to have it search an area double the size of the projectile
			let others = this.collisionTree.query(projectile.makeShape(2));
			for (let other of others) {
				if (other.owner === projectile) continue;
				if (projectileShape.intersects(other.owner.makeShape(1))) {
					projectile.overlapping = true;
					other.owner.overlapping = true;
				}
			}
		}
	}

	addProjectile(newProjectile) {
		this.projectiles.push(newProjectile);
		this.canvas.addDrawable(newProjectile);
        this.socket.emit("newProjectile", newProjectile.makeObject());
	}
}

export default Map;