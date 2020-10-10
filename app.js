import express from "express";
import ejs from "ejs";
import ejsLint from "ejs-lint";
import dotenv from "dotenv";
import ServerLoop from "./src/serverJS/serverLoop.js";
import { loadMap } from "./src/serverJS/serverUtils.js";
//import { MAPNAME } from "./sharedJS/utils/enums.js";

const result = dotenv.config();

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

let server = app.listen(app.get('port'), app.get('ip'),()=>{console.info(`Express Server is Running at http://${app.get('ip')}:${app.get('port')}`);});

//create a new server
let serverLoop = new ServerLoop(server);
