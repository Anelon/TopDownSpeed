import io from "socket.io";
import Vec2 from "../sharedJS/vec2.js";
import Player from "../sharedJS/player.js";
import CHANNELS from "../sharedJS/channels.js";
import CollisionEngine from "../sharedJS/collisionEngine.js";
import Projectile from "../sharedJS/projectile.js";
import { Circle } from "../sharedJS/shapes.js";
import { makeFromJSON } from "../sharedJS/utils.js";

class Connections {
    /**
     * @param {import("http").Server | import("https").Server} server
     * @param {CollisionEngine} collisionEngine
     */
    constructor(server, collisionEngine, connections = {}) {
        if(!(collisionEngine instanceof CollisionEngine)) throw TypeError("collisionEngine is not a collisionEngine object;");
        this.sockets = io(server);
        this.connections = connections;
        this.collisionEngine = collisionEngine;
    }

    start() {
        this.sockets.on("connection", (client) => {
            console.log("a user has connected");
            //add client to the list of connections
            this.connections[client.id] = client; 
            const location = new Vec2(50,50);//TODO set spawn based on map infoation
            let player = new Player(location, "Player", "./img/player.png", 200, 200, new Circle(location, 32), 4);
            //set player id to client id for easier lookup
            player.id = client.id;
            console.log(player);
            this.collisionEngine.addPlayer(player);
            client.emit(CHANNELS.newPlayer, player.makeObject());
            this.broadcast(CHANNELS.playerMove, player.makeObject(), client);
            //console.log("collisionEngine:", this.collisionEngine.players);

            client.on("disconnect", (event) => {
                console.log("a user has disconnected");
                this.broadcast(CHANNELS.deletePlayer, client.id);
                this.collisionEngine.removePlayer(client.id);
                //console.log("collisionEngine:", this.collisionEngine.players);
            });

            client.on("event", (event) => {
                console.log("a user has evented");
            });

            client.on(CHANNELS.playerMove, (playerInfo) => {
                let updated = JSON.parse(playerInfo.json);
                //console.log("PlayerMove: ", updated);
                this.collisionEngine.updatePlayer(updated);
                //TODO: add validation of move here
                //broadcast the message (add client to prevent echoing)
                this.broadcast(CHANNELS.playerMove, playerInfo, client);
            });

            client.on(CHANNELS.newProjectile, (newProjectile) => {
                const updated = JSON.parse(newProjectile.json);
                //console.log(updated);
                this.collisionEngine.addProjectile(makeFromJSON(newProjectile));
                //console.log(this.collisionEngine);
                //TODO: add validation of move here
                //broadcast the message (add client to prevent echoing)
                this.broadcast(CHANNELS.newProjectile, newProjectile, client);

            });
        });
    }

    /**
     * @param {{ id: string | number; }} client
     */
    add(client) {
        this.connections[client.id] = client;
    }

    //broadcasts a message on a channel, if sender exists it sends to everyone else
    /**
     * @param {string} channel
     * @param {string} message
     * @param {io.Socket} [sender]
     */
    broadcast(channel, message, sender) {
        if(sender) {
            sender.broadcast.emit(channel, message);
        } else {
            this.sockets.emit(channel, message);
        }

    }
}

export default Connections;
