//Enum of the type strings for consistency
const TYPES = {
    //ability types
    basic: "basic",
    fire: "fire",
    water: "water",
    plant: "plant",
}
//lock the enum
Object.freeze(TYPES);

const CATEGORY = {
    //terain types
    wall: "wall",
    void: "void",
    //can be damaged
    damageable: "damageable",
    //Projectile
    projectile: "projectile",
    //base
    none: "none"
}
//lock the enum
Object.freeze(CATEGORY);

export { TYPES, CATEGORY };