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
//const pipeholder = document.getElementById("pipe-container")!;
const scoretext = document.getElementById("score");
const gameover = document.getElementById("gameover");
const restart = document.getElementById("restart");
const gameOverScore = document.getElementById("gameOverScore");
let pipeContainers = [];
let pipeContainerXPositions = [];
let pipeScored = [];
let createPipeInterval;
createPipeInterval = setInterval(createPipe, 2300);
let gameLoop = setInterval(update, 10);
// Update function
function update() {
    // setting score
    scoretext.innerHTML = `Score: ${score}`;
    // Setting the positions
    velocity += gravity * deltaTime;
    positionY += velocity * deltaTime;
    positionXGround += speed * deltaTime;
    positionXPipes += speed * deltaTime;
    // stop game when player touches bottom of the screen
    if (positionY >= groundLevel) {
        positionY = groundLevel;
        velocity = 0;
        console.log("Player reached bottom -- Game Over");
        running = false;
        gameOver();
        clearInterval(gameLoop);
    }
    // stop game when player touches top of the screen
    else if (positionY <= skylevel) {
        positionY = skylevel;
        velocity = 0;
        console.log("Player reached sky -- Game Over");
        running = false;
        gameOver();
        clearInterval(gameLoop);
    }
    //Moving player
    player.style.top = `${positionY}px`;
    // set ground to startposition when it reaches end position for a "loop"
    if (positionXGround <= -ground1.offsetWidth) {
        positionXGround = 0;
    }
    //moving the ground
    ground1.style.left = `${positionXGround}px`;
    ground2.style.left = `${positionXGround + ground1.offsetWidth - 1}px`;
    ground3.style.left = `${positionXGround + ground1.offsetWidth - 1}px`;
    //Moving the test pipes
    //pipeholder.style.left = `${positionXPipes}px`;
    //console.log(pipeContainers);
    if (pipeContainers.length > 0) {
        for (let i = 0; i < pipeContainers.length; i++) {
            pipeContainerXPositions[i] += speed * deltaTime;
            let pos = pipeContainerXPositions[i];
            pipeContainers[i].style.left = `${pos}px`;
            if (pipeContainerXPositions[i] <= 50 && pipeScored[i] === false) {
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
        gameOver();
        clearInterval(gameLoop);
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
function getRandomPipeHeight(minHeight, maxHeight) {
    return Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
}
function createPipe() {
    const pipeStartPos = 1350;
    if (!running)
        return;
    const pipeContainer = document.createElement("div");
    pipeContainer.classList.add("pipe-container");
    pipeContainer.style.left = `${pipeStartPos}px`;
    // Create to and down pipes
    const pipeUp = document.createElement("div");
    pipeUp.classList.add("pipe");
    pipeUp.classList.add("pipe-up");
    const pipeDown = document.createElement("div");
    pipeDown.classList.add("pipe");
    pipeDown.classList.add("pipe-down");
    // random height for pipe
    pipeUp.style.position = "absolute";
    const pipeHeight = getRandomPipeHeight(50, 300);
    pipeUp.style.height = `${pipeHeight}px`;
    const gap = 200;
    pipeDown.style.position = "absolute";
    pipeDown.style.top = `${pipeHeight + gap}px`;
    pipeDown.style.height = `calc(100vh - ${pipeHeight + gap}px)`;
    pipeContainer.appendChild(pipeUp);
    pipeContainer.appendChild(pipeDown);
    document.body.appendChild(pipeContainer);
    pipeContainers.push(pipeContainer);
    pipeContainerXPositions.push(pipeStartPos);
    pipeScored.push(false);
}
//game over
function gameOver() {
    if (running === false) {
        gameover.style.display = "block";
        gameOverScore.innerHTML = `Your Score is: ${score}`;
    }
}
restart === null || restart === void 0 ? void 0 : restart.addEventListener("click", restartGame);
function restartGame() {
    // 1. stop every interval
    clearInterval(gameLoop);
    clearInterval(createPipeInterval);
    // 2. reset variables
    positionY = 100; // reset startheight
    velocity = 0; // set speed to 0
    positionXGround = 0;
    positionXPipes = 300;
    score = 0;
    scoretext.innerHTML = `Score: ${score}`;
    running = true;
    // empty arrays and DOM-Elements
    pipeContainers.forEach(pipe => pipe.remove());
    pipeContainers = [];
    pipeContainerXPositions = [];
    pipeScored = [];
    // 3. hide game over
    gameover.style.display = "none";
    // 4. start new intervals
    gameLoop = setInterval(update, 10);
    createPipeInterval = setInterval(createPipe, 2300);
}
