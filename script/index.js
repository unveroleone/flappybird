"use strict";
let gravity = 9.81;
let velocity = 0;
let positionY = 100; // start height in px
let positionXGround = 0; // start position in px
let positionXPipes = 300;
let speed = -10;
let deltaTime = 0.1;
let jumpForce = 40;
const skylevel = 0;
const groundLevel = 555; // bottom height in px
let score = 0;
let running = true;
const player = document.getElementById("player");
const ground1 = document.getElementById("ground1");
const ground2 = document.getElementById("ground2");
const ground3 = document.getElementById("ground3");
const pipes = document.getElementsByClassName("pipe");
const pipeholder = document.getElementById("pipe-container");
const scoretext = document.getElementById("score");
let pipeContainers = [];
let pipeContainerXPositions = [];
let pipeScored = [];
let createPipeInterval;
createPipeInterval = setInterval(createPipe, 2300);
function update() {
    scoretext.innerHTML = `Score: ${score}`;
    velocity += gravity * deltaTime;
    positionY += velocity * deltaTime;
    positionXGround += speed * deltaTime;
    positionXPipes += speed * deltaTime;
    if (positionY >= groundLevel) {
        positionY = groundLevel;
        velocity = 0;
        console.log("Player reached bottom -- Game Over");
        clearInterval(gameLoop);
        running = false;
    }
    else if (positionY <= skylevel) {
        positionY = skylevel;
        velocity = 0;
        console.log("Player reached sky -- Game Over");
        clearInterval(gameLoop);
        running = false;
    }
    if (positionXGround <= -ground1.offsetWidth) {
        positionXGround = 0;
    }
    player.style.top = `${positionY}px`;
    ground1.style.left = `${positionXGround}px`;
    ground2.style.left = `${positionXGround + ground1.offsetWidth - 1}px`;
    ground3.style.left = `${positionXGround + ground1.offsetWidth - 1}px`;
    pipeholder.style.left = `${positionXPipes}px`;
    console.log(pipeContainers);
    if (pipeContainers.length > 0) {
        for (let i = 0; i < pipeContainers.length; i++) {
            pipeContainerXPositions[i] += speed * deltaTime;
            let pos = pipeContainerXPositions[i];
            pipeContainers[i].style.left = `${pos}px`;
            if (pipeContainerXPositions[i] <= 50) {
                pipeScored[i] = true;
                score++;
            }
        }
    }
    console.log(`Position: ${positionY.toFixed(2)}px, Geschwindigkeit: ${velocity.toFixed(2)}px/s`);
    console.log(`Position: ${positionXPipes.toFixed(2)}px`);
    if (isCollidingWithAny(player, pipes)) {
        console.log("Collision detected with a pipe!");
        running = false;
        clearInterval(gameLoop);
    }
    else {
    }
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
function isCollidingWithAny(player, pipes) {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        if (isColliding(player, pipe)) {
            return true; // Collision detected with at least one pipe
        }
    }
    return false; // No collision detected
}
function isColliding(el1, el2) {
    if (!el1 || !el2)
        return false;
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    const shrink = 5;
    return (rect1.left + shrink < rect2.right - shrink &&
        rect1.right - shrink > rect2.left + shrink &&
        rect1.top + shrink < rect2.bottom - shrink &&
        rect1.bottom - shrink > rect2.top + shrink);
}
document.addEventListener("wheel", function (event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });
function getRandomPipeHeight() {
    const minHeight = 50;
    const maxHeight = 300;
    return Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
}
function createPipe() {
    if (!running)
        return;
    const pipeContainer = document.createElement("div");
    pipeContainer.classList.add("pipe-container");
    pipeContainer.style.left = "1200px";
    // Erstelle obere und untere Röhre
    const pipeUp = document.createElement("div");
    pipeUp.classList.add("pipe-up");
    const pipeDown = document.createElement("div");
    pipeDown.classList.add("pipe-down");
    // Zufällige Höhe für obere Röhre
    const pipeHeight = getRandomPipeHeight();
    pipeUp.style.height = `${pipeHeight}px`;
    const gap = 150;
    pipeDown.style.height = `${window.innerHeight - pipeHeight - gap}px`;
    pipeContainer.appendChild(pipeUp);
    pipeContainer.appendChild(pipeDown);
    document.body.appendChild(pipeContainer);
    pipeContainers.push(pipeContainer);
    pipeContainerXPositions.push(600);
    pipeScored.push(false);
}
//game over
let gameover = document.getElementById("gameover");
