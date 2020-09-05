//Enum of the type strings for consistency
const TYPES = {
    //terain types
    wall: "wall",
    void: "void",
    //creature types
    player: "player",
    monster: "monster",
    //ability types
    basic: "basic",
    fire: "fire",
    water: "water",
    plant: "plant",
}
//lock the enum
Object.freeze(TYPES);

export default TYPES;