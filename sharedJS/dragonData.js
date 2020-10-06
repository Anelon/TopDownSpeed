export const keyFrames = new Map(
    [
        ["attack1_55", "melee"],
        ["attack2_130", "fireball"],
        ["death_160", "kill"],//remove hitbox from collision
        ["death_300", "delete"],//remove hitbox from collision
    ]
);
export const animations = {
    attack1: "attack1", attack2: "attack2", death: "death", hurt: "hurt", idle: "idle", idleBattle: "idleBattle", walking: "walking"
};
export const animationLengths = new Map([
    [animations.attack1, 161],
    [animations.attack2, 202],
    [animations.death, 301],
    [animations.hurt, 62],
    [animations.idle, 161],
    [animations.idleBattle, 140],
    [animations.walking, 161],
])