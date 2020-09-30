import express from "express";
import ejs from "ejs";
import ejsLint from "ejs-lint";
import ServerLoop from "./serverJS/serverLoop.js";
import GameMap from "./sharedJS/map/gameMap.js";
import { loadMap, loadMapSync } from "./serverJS/serverUtils.js";

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/js/sharedJS", express.static("sharedJS"));
app.use("/js/clientJS", express.static("clientJS"));

app.engine("html", ejs.renderFile);
app.set("port", process.env.PORT || "3000");
app.set("ip", process.env.IP || "0.0.0.0");
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
app.get("/api/getMap/:mapName", async function(req, res) {
    const mapJSON = JSON.parse(await loadMap(req.params.mapName));
    res.send({"data": mapJSON});
});

const mapJSON = JSON.parse(loadMapSync("map"));
const gameMap = GameMap.makeFromJSON(mapJSON);

let server = app.listen(app.get('port'), app.get('ip'),()=>{console.log(`Express Server is Running at http://${app.get('ip')}:${app.get('port')}`);});

//create a new server
let serverLoop = new ServerLoop(server);
