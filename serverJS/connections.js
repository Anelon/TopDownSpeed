import io from "socket.io";
import Vec2 from "../sharedJS/vec2.js";
import Player from "../sharedJS/player.js";
import CHANNELS from "../sharedJS/utils/channels.js";
import CollisionEngine from "../sharedJS/collisionEngine.js";
import { Circle } from "../sharedJS/shapes.js";
import { projectileFromJSON } from "../sharedJS/utils/utils.js";

export default class Connections {
    /**
     * @param {import("http").Server | import("https").Server} server
     * @param {CollisionEngine} collisionEngine
     */
    constructor(server, collisionEngine, gameMap, connections = {}) {
        if(!(collisionEngine instanceof CollisionEngine)) throw TypeError("collisionEngine is not a collisionEngine object;");
        this.sockets = io(server);
        this.gameMap = gameMap;
        this.connections = connections;
        this.collisionEngine = collisionEngine;
    }

    start() {
        this.sockets.on("connection", (client) => {
            console.log("a user has connected");
            //add client to the list of connections
            this.connections[client.id] = client; 
            const spawn = new Vec2(50,50);//TODO set spawn based on map infoation
            let player = new Player(spawn, "Player", "./img/player.png", 200, 200, new Circle(spawn, 32), 2);
            //set player id to client id for easier lookup
            player.id = client.id;
            //send the client their player
            client.emit(CHANNELS.newPlayer, player.makeObject());
            //send client all existing players
            for (const players of this.collisionEngine.players.values()) {
                client.emit(CHANNELS.playerMove, players.makeObject());
            }
            //send client all existing projectiles
            for (const projectile of this.collisionEngine.projectiles.values()) {
                client.emit(CHANNELS.newProjectile, projectile.makeObject());
            }
            //add player to collisionEngine
            this.collisionEngine.addPlayer(player);
            //send the other players the new player
            this.broadcast(CHANNELS.playerMove, player.makeObject(), client);

            client.on("disconnect", (event) => {
                console.log("a user has disconnected");
                this.broadcast(CHANNELS.deletePlayer, client.id);
                this.collisionEngine.removePlayer(client.id);
            });

            client.on("event", (event) => {
                console.log("a user has evented");
            });

            client.on(CHANNELS.playerMove, (playerInfo) => {
                let updated = JSON.parse(playerInfo.json);
                this.collisionEngine.updatePlayer(updated);
                //TODO: add validation of move here
                //broadcast the message (add client to prevent echoing)
                this.broadcast(CHANNELS.playerMove, playerInfo, client);
            });

            client.on(CHANNELS.newProjectile, (newProjectile) => {
                const updated = JSON.parse(newProjectile.json);
                this.collisionEngine.addProjectile(projectileFromJSON(newProjectile));
                //TODO: add validation of move here
                //broadcast the message (add client to prevent echoing)
                this.broadcast(CHANNELS.newProjectile, newProjectile, client);
            });
        });
        return this;
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
