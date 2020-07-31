import Vec2 from "./sharedJS/vec2.mjs";
import { Player } from "./sharedJS/player.mjs";
import express from "express";
import ejs from "ejs";
import ejsLint from "ejs-lint";
import io from "socket.io";

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.engine("html", ejs.renderFile);
app.set("port", process.env.PORT || "8080");
app.set("ip", process.env.IP || "localhost");
app.use(express.static("public"));
ejsLint("index");


//Paths
app.get("/", function(req, res) {
    res.render("index");
});
app.get("/game", function(req, res) {
    res.render("game");
});

//console.log(new Vec2(1,2).log());


let server = app.listen(app.get('port'), app.get('ip'),()=>{console.log(`Express Server is Running at http://${app.get('ip')}:${app.get('port')}`);});

let socket = io(server);
let clients = {};
/* how to loop through the clients if needed
for(let id in clients) {
    console.log(clients[id]);
}
*/

socket.on("connection", (client) => {
    console.log("a user has connected");
    //add client to the list of clients
    clients[client.id] = client;
    let player = new Player(new Vec2(10,10), "Player", "./img/arrow.png", 100);
    //console.log(clients);

    client.on("disconnect", (client) => {
        console.log("a user has disconnected");
    });

    client.on("event", (client) => {
        console.log("a user has evented");
    });

    client.on("playerMove", (playerInfo) => {
        //console.log("PlayerMove: ", playerInfo);
        let updated = JSON.parse(playerInfo.json);
        //console.log(updated);
    });
});

