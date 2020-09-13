import Region from "./region";
import { Rectangle } from "../shapes";

export default class ObjectiveRegion extends Region {
    /**
     * @param {string} name
     * @param {Rectangle} area
     */
    constructor(name, area) {
        super(name, area);
    }

    //call when player overlaps
    hit(other) {
    }
}