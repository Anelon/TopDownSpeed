import io from "socket.io";
import Vec2 from "../sharedJS/vec2.js";
import Player from "../sharedJS/player.js";
import CHANNELS from "../sharedJS/channels.js";
import GameMap from "../sharedJS/map.js";
import Projectile from "../sharedJS/projectile.js";

class Connections {
    constructor(server, map, connections = {}) {
        if(!(map instanceof GameMap)) throw TypeError("map is not a Map object;");
        this.sockets = io(server);
        this.connections = connections;
        this.map = map;
    }

    start() {
        this.sockets.on("connection", (client) => {
            console.log("a user has connected");
            //add client to the list of connections
            this.connections[client.id] = client;
            let player = new Player(new Vec2(50, 50), "Player", "./img/arrow.png", 200, 200);
            //set player id to client id for easier lookup
            player.id = client.id;
            this.map.addPlayer(player);
            client.emit(CHANNELS.newPlayer, player.makeObject());
            console.log("map:", this.map);

            client.on("disconnect", (client) => {
                console.log("a user has disconnected");
            });

            client.on("event", (client) => {
                console.log("a user has evented");
            });

            client.on(CHANNELS.playerMove, (playerInfo) => {
                //console.log("PlayerMove: ", playerInfo);
                let updated = JSON.parse(playerInfo.json);
                //TODO: add validation of move here
                //broadcast the message (add client to prevent echoing)
                this.broadcast(CHANNELS.playerMove, playerInfo);
            });

            client.on(CHANNELS.newProjectile, (newProjectile) => {
                const updated = JSON.parse(newProjectile.json);
                this.map.addProjectile(Projectile.makeFromJSON(updated));
                console.log(this.map);
                //TODO: add validation of move here
                //broadcast the message (add client to prevent echoing)
                this.broadcast(CHANNELS.newProjectile, newProjectile /*, client*/);
            });
        });
    }

    add(client) {
        this.connections[client.id] = client;
    }

    //broadcasts a message on a channel, if sender exists it sends to everyone else
    broadcast(channel, message, sender) {
        if(sender) {
            sender.broadcast.emit(channel, message);
        } else {
            this.sockets.emit(channel, message);
        }

    }
}

export default Connections;
