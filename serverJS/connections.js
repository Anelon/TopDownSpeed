import io from "socket.io";
import Vec2 from "../sharedJS/vec2.js";
import Player from "../sharedJS/player.js";
import CHANNELS from "../sharedJS/utils/channels.js";
import CollisionEngine from "../sharedJS/collisionEngine.js";
import { Circle } from "../sharedJS/shapes.js";
import { projectileFromJSON } from "../sharedJS/utils/utils.js";
import { CATEGORY, MaxPlayers, REGION_NAMES } from "../sharedJS/utils/enums.js";
import { getProjectileID } from "./serverUtils.js";
/** @typedef {import("../sharedJS/map/gameMap.js").default} GameMap */

export default class Connections {
    /**
     * @param {import("http").Server | import("https").Server} server
     * @param {CollisionEngine} collisionEngine
     * @param {GameMap} gameMap
     */
    constructor(server, collisionEngine, gameMap, serverLoop, connections = new Map()) {
        if(!(collisionEngine instanceof CollisionEngine)) throw TypeError("collisionEngine is not a collisionEngine object;");
        this.sockets = io(server);
        this.gameMap = gameMap;
        this.connections = connections;
        this.collisionEngine = collisionEngine;
        this.serverLoop = serverLoop;
        this.readyCount = 0;
    }

    start() {
        this.sockets.on("connection", (client) => {
            if(this.connections.size >= MaxPlayers) {
                console.info("Too Many Players Connected");
                //disabled for now 
                //return;
            }
            //add client to the list of connections
            this.connections.set(client.id, client);
            let setLane = null;
            let leastPlayers = MaxPlayers;
            for(const [laneName, lane] of this.gameMap.lanes) {
                if(lane.players.size < leastPlayers) {
                    leastPlayers = lane.players.size;
                    setLane = laneName;
                }
            }
            const spawn = this.gameMap.lanes.get(setLane).regions.get(REGION_NAMES.spawn).center.clone();
            let player = new Player(spawn, "Player", "player", 200, 200, new Circle(spawn, Player.WIDTH), 2);
            //set player id to client id for easier lookup
            player.id = client.id;
            this.gameMap.addPlayer(player, setLane);
            //send the client their player
            client.emit(CHANNELS.newPlayer, player.makeObject());
            //add player to collisionEngine
            this.collisionEngine.addPlayer(player);
            //save the player to the connection
            this.connections.get(client.id).player = player;
            this.connections.get(client.id).ready = false;
            //send the other players the new player
            this.broadcast(CHANNELS.playerMove, player.makeObject(), client);

            client.on("disconnect", (event) => {
                console.info("a user has disconnected");
                this.broadcast(CHANNELS.deletePlayer, client.id);
                this.collisionEngine.removePlayer(client.id);
            });

            client.on("event", (event) => {
                console.info("a user has evented");
            });

            client.on(CHANNELS.playerMove, (playerInfo) => {
                //TODO: add validation of move here
                //broadcast the message (add client to prevent echoing)
                this.broadcast(CHANNELS.playerMove, playerInfo, client);
                let updated = JSON.parse(playerInfo.json);
                //if player moving isn't connected ignore it
                this.collisionEngine.updatePlayer(updated);
            });

            client.on(CHANNELS.newProjectile, (newProjectile, fn) => {
                //const updated = JSON.parse(newProjectile.json);
                const projectile = projectileFromJSON(newProjectile);
                projectile.id = getProjectileID().toString();
                this.collisionEngine.addDynamic(projectile);
                //TODO: add validation of move here
                //broadcast the message (add client to prevent echoing)
                this.broadcast(CHANNELS.newProjectile, projectile.makeObject(), client);

                //send projectileid back to client
                fn(projectile.id);
            });

            client.on(CHANNELS.deletePlayer, (playerInfo) => {
                //send the deleted player to other clients
                this.broadcast(CHANNELS.deletePlayer, playerInfo.id, client);
                this.collisionEngine.removePlayer(playerInfo.id);
            });

            client.on(CHANNELS.deleteProjectile, (projectileID) => {
                console.log("Recieved Delete Projectile", projectileID);
                //send the deleted player to other clients
                this.broadcast(CHANNELS.deleteProjectile, projectileID, client);
                this.collisionEngine.removeDynamic(projectileID);
            });

            //gameName can be used later if we can have more than one game going on a server
            client.on(CHANNELS.gameData, (gameName) => {
                //send client all existing players
                for (const players of this.collisionEngine.players.values()) {
                    //if the player isn't connected dont send
                    if (!this.connections.has(players.id)) {
                        continue;
                    }
                    client.emit(CHANNELS.playerMove, players.makeObject());
                }
                //send client all existing dynamics
                for (const projectile of this.collisionEngine.dynamics.values()) {
                    if(projectile.category === CATEGORY.dragon) continue;
                    client.emit(CHANNELS.newProjectile, projectile.makeObject());
                }
            });

            client.on(CHANNELS.ready, (data) => {
                const player = this.collisionEngine.players.get(client.id);
                //if there is a display name set it
                if(data.displayName) {
                    player.name = data.displayName;
                } else { 
                    //else just use the client id I guess
                    player.name = client.id;
                }
                this.connections.get(client.id).ready = data.ready;
                //if ready add to count and check if there is enough ready
                if(data.ready) {
                    this.readyCount++;
                    //TODO add check that there is more than the minPlayers
                    if(this.readyCount === this.collisionEngine.players.size) {
                        this.broadcast(CHANNELS.startGame, "start");
                        console.info("starting game");
                        this.serverLoop.start();
                    } else if (this.readyCount > this.collisionEngine.players.size) {
                        //just tell the client that just readied to start
                        client.emit(CHANNELS.startGame, "quientStart")
                    }
                } else {
                    //unready the player
                    this.readyCount--;
                }
            })
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

    //broadcasts a message on a channel, if sender exists it sends to everyone else
    /**
     * @param {string} playerID
     * @param {string} channel
     * @param {any} message
     */
    message(playerID, channel, message) {
        if (this.connections.has(playerID))
            this.connections.get(playerID).emit(channel, message);
        else
            this.sockets.emit(channel, message);
    }
}
