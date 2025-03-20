"use strict";
let gravity = 9.81;
let velocity = 0;
let positionY = 100; // start height in px
let positionX = 0; // start position in px
let speed = 10;
let deltaTime = 0.1;
let jumpForce = 50;
const skylevel = 0;
const groundLevel = 537; // botom height in px
const player = document.getElementById("player");
function update() {
    velocity += gravity * deltaTime;
    positionY += velocity * deltaTime;
    positionX += speed * deltaTime;
    if (positionY >= groundLevel) {
        positionY = groundLevel; // stopps falling
        velocity = 0;
        console.log("Player reached bottom -- Game Over");
        clearInterval(gameLoop);
    }
    else if (positionY <= skylevel) {
        positionY = skylevel;
        velocity = 0;
        console.log("Player reached sky -- Game Over");
        clearInterval(gameLoop);
    }
    player.style.top = `${positionY}px`;
    player.style.left = `${positionX}px`;
    console.log(`Position: ${positionY.toFixed(2)}px, Geschwindigkeit: ${velocity.toFixed(2)}px/s`);
}
function Jump() {
    velocity = -jumpForce;
}
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        Jump();
    }
});
let gameLoop = setInterval(update, deltaTime * 100);
