import Time from "../sharedJS/time.mjs";
import Connections from "./connections.mjs";

//basic time object to pass to funcitons
const time = new Time();
const connections = new Connections();

function update(time) {
    //update all projectiles

    //check if anyone is ready to think

}


function tick() {
    time.update();
    while (time.dt > time.tickRate) {
        time.dt = time.dt - time.tickRate;
        update(time);
    }
    sendToClients(time);
}

setImmediate()