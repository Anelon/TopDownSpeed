import fs from "fs";

const mapPath = "./maps/";
export function loadMap(mapName) {
    //TODO regex to make sure map name is just a string
    return fs.promises.readFile(`${mapPath+mapName}.json`, "utf8");
}
export function loadMapSync(mapName) {
    //TODO regex to make sure map name is just a string
    return fs.readFileSync(`${mapPath+mapName}.json`, "utf8");
}