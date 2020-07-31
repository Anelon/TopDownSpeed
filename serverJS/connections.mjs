import io from "socket.io";

class Connections {
    constructor(server, connections = {}) {
        this.connections = connections;
    }
    add(client) {
        this.connections[client.id] = client;
    }
}