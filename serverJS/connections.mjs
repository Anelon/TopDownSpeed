import io from "socket.io";
import Vec2 from "../sharedJS/vec2.mjs";
import Player from "../sharedJS/player.mjs";

class Connections {
    constructor(server, connections = {}) {
        this.sockets = io(server);
        this.connections = connections;

        this.sockets.on("connection", (client) => {
            console.log("a user has connected");
            //add client to the list of connections
            this.connections[client.id] = client;
            let player = new Player(new Vec2(50, 50), "Player", "./img/arrow.png", 200, 200);
            //console.log(client)
            client.emit("newPlayer", player.makeObject());

            client.on("disconnect", (client) => {
                console.log("a user has disconnected");
            });

            client.on("event", (client) => {
                console.log("a user has evented");
            });

            client.on("playerMove", (playerInfo) => {
                //console.log("PlayerMove: ", playerInfo);
                let updated = JSON.parse(playerInfo.json);
                //TODO: add validation of move here
                //broadcast the player move to all other players
                //playerInfo.broadcast.emit(playerInfo.json);
                this.sockets.emit("playerMove", playerInfo);
            });

            client.on("newProjectile", (newProjectile) => {
                console.log("New Projectile: ", newProjectile);
                let updated = JSON.parse(newProjectile.json);
                //TODO: add validation of move here
                //broadcast the player move to all other players
                //playerInfo.broadcast.emit(playerInfo.json);
                this.sockets.emit("playerMove", newProjectile);
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