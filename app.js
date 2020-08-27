import express from "express";
import ejs from "ejs";
import ejsLint from "ejs-lint";
import ServerLoop from "./serverJS/serverLoop.js";
import io from "socket.io";

//local modules for import
import Vec2 from "./sharedJS/vec2.js";
import Player from "./sharedJS/player.js";

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/js/sharedJS", express.static("sharedJS"));
app.use("/js/clientJS", express.static("clientJS"));

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
app.get("/mapEditor", function(req, res) {
    res.render("mapEditor");
});


let server = app.listen(app.get('port'), app.get('ip'),()=>{console.log(`Express Server is Running at http://${app.get('ip')}:${app.get('port')}`);});

//create a new server
let serverLoop = new ServerLoop(server);
//run the server
serverLoop.start();