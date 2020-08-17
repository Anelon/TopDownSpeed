import Vec2 from "./vec2.mjs";

//Might have this extend Circle
class Point {
	constructor(location, owner = null, radius = 2) {
		if(!(location instanceof Vec2))
			throw TypeError("Particle Location needs to be Vec2");

        this.location = location;
        //this is what this point is attached to
        this.owner = owner;
		this.radius = radius;
		this.color = "#aaaaaa";
    }
    //leaving in for debugging
	draw(ctx, color) {
		ctx.beginPath();
		ctx.arc(this.location.x, this.location.y, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = color || this.color;
		ctx.fill();
	}
	//figure out what get location would look like
	getLocation() {
		return this.location.clone();
	}
	get y() {
		return this.location.y;
	}
	get x() {
		return this.location.x;
	}
}

export default Point;
