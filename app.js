import Vec2 from "./public/js/vec2.mjs";
import express from "express";
import ejs from "ejs";
import ejsLint from "ejs-lint";

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


app.listen(app.get('port'), app.get('ip'),()=>{console.log(`Express Server is Running at http://${app.get('ip')}:${app.get('port')}`);});
