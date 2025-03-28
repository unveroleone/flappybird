"use strict";
let gravity = 2000; // pixels/s²
let velocity = 0;
let positionY = 300;
let positionXGround = 0;
let positionXPipes = 300;
let speed = -300; // pixels/s
let originalSpeed = -300;
let jumpForce = 600;
let difficulty = "easy";
let easyMultiplier = 1;
let mediumMultiplier = 1.5;
let hardMultiplier = 2;
let originalSpawnTime = 1500;
let lastScore = 0;
let multiplier = 1;
const skylevel = 0;
const groundLevel = 555;
let score = 0;
let running = true;
const player = document.getElementById("player");
const ground1 = document.getElementById("ground1");
const ground2 = document.getElementById("ground2");
const ground3 = document.getElementById("ground3");
const pipes = document.getElementsByClassName("pipe");
const scoretext = document.getElementById("score");
const gameover = document.getElementById("gameover");
const restart = document.getElementById("restart");
const gameOverScore = document.getElementById("gameOverScore");
const mainMenu = document.getElementById("MainMenu");
const fpsCounter = document.getElementById("fps-counter");
const background = document.getElementById("background");
const difficultySelector = document.getElementById("difficulty");
let pipeContainers = [];
let pipeContainerXPositions = [];
let pipeScored = [];
let gameStarted = false;
let createPipeInterval;
let lastTime = performance.now();
function update(deltaTime) {
    difficulty = difficultySelector.value;
    scoretext.innerHTML = `Score: ${score}`;
    console.log(difficulty);
    // Update positions
    if (gameStarted) {
        velocity += gravity * deltaTime;
        positionY += velocity * deltaTime;
        positionXPipes += speed * deltaTime;
    }
    positionXGround += speed * deltaTime;
    // Clamp to screen bounds
    if (positionY >= groundLevel) {
        positionY = groundLevel;
        velocity = 0;
        running = false;
        gameOver();
        return;
    }
    else if (positionY <= skylevel) {
        positionY = skylevel;
        velocity = 0;
        running = false;
        gameOver();
        return;
    }
    player.style.top = `${positionY}px`;
    if (positionXGround <= -ground1.offsetWidth) {
        positionXGround = 0;
    }
    ground1.style.left = `${positionXGround}px`;
    ground2.style.left = `${positionXGround + ground1.offsetWidth - 1}px`;
    ground3.style.left = `${positionXGround + 2 * ground1.offsetWidth - 2}px`;
    // Move pipes
    for (let i = 0; i < pipeContainers.length; i++) {
        pipeContainerXPositions[i] += speed * deltaTime;
        const pos = pipeContainerXPositions[i];
        pipeContainers[i].style.left = `${pos}px`;
        if (pos <= -20 && !pipeScored[i]) {
            pipeScored[i] = true;
            score++;
        }
        if (pos <= -200) {
            pipeContainers[i].remove();
            pipeContainers.splice(i, 1);
            pipeContainerXPositions.splice(i, 1);
            pipeScored.splice(i, 1);
            i--;
        }
    }
    if (isCollidingWithAny(player, pipes)) {
        running = false;
        gameOver();
        return;
    }
    if (difficulty === "easy") {
        multiplier = easyMultiplier;
    }
    else if (difficulty === "medium") {
        multiplier = mediumMultiplier;
    }
    else if (difficulty === "hard") {
        multiplier = hardMultiplier;
    }
    if (score === lastScore + 15 && difficulty === "Easy") {
        clearInterval(createPipeInterval);
        createPipeInterval = setInterval(createPipe, originalSpawnTime * multiplier + speed * 5);
        lastScore += 15;
        speed *= 1.1;
    }
    else if (score === lastScore + 15 && difficulty === "Medium") {
        clearInterval(createPipeInterval);
        createPipeInterval = setInterval(createPipe, originalSpawnTime * multiplier + speed * 10);
        lastScore += 15;
        speed *= 1.5;
    }
    else if (score === lastScore + 5 && difficulty === "Hard") {
        clearInterval(createPipeInterval);
        createPipeInterval = setInterval(createPipe, originalSpawnTime * multiplier + speed * 15);
        lastScore += 5;
        speed *= 2;
    }
}
function gameLoopFunction(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    if (running) {
        update(deltaTime);
        requestAnimationFrame(gameLoopFunction);
    }
}
function Jump() {
    velocity = -jumpForce;
}
function isCollidingWithAny(player, pipes) {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        if (isColliding(player, pipe)) {
            return true;
        }
    }
    return false;
}
function isColliding(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    const shrink = 5;
    return (rect1.left + shrink < rect2.right - shrink &&
        rect1.right - shrink > rect2.left + shrink &&
        rect1.top + shrink < rect2.bottom - shrink &&
        rect1.bottom - shrink > rect2.top + shrink);
}
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        if (!gameStarted) {
            gameStarted = true;
        }
        Jump();
    }
});
document.addEventListener("wheel", function (event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });
function createPipe() {
    mainMenu.style.display = "none";
    if (!running)
        return;
    if (!gameStarted)
        return;
    const pipeStartPos = 1350;
    const pipeContainer = document.createElement("div");
    pipeContainer.classList.add("pipe-container");
    pipeContainer.style.left = `${pipeStartPos}px`;
    const pipeUp = document.createElement("div");
    pipeUp.classList.add("pipe", "pipe-up");
    const pipeDown = document.createElement("div");
    pipeDown.classList.add("pipe", "pipe-down");
    pipeContainer.appendChild(pipeUp);
    pipeContainer.appendChild(pipeDown);
    const minOffset = -300;
    const maxOffset = 0;
    const randomOffset = Math.floor(Math.random() * (maxOffset - minOffset + 1)) + minOffset;
    pipeContainer.style.top = `${randomOffset}px`;
    document.body.appendChild(pipeContainer);
    pipeContainers.push(pipeContainer);
    pipeContainerXPositions.push(pipeStartPos);
    pipeScored.push(false);
}
function gameOver() {
    gameStarted = false;
    gameover.style.display = "block";
    if (score > 25) {
        gameOverScore.innerHTML = `Your Score is: ${score}! You are a pro!`;
    }
    else {
        gameOverScore.innerHTML = `Your Score is: ${score}. You can do better!`;
    }
    clearInterval(createPipeInterval);
}
restart === null || restart === void 0 ? void 0 : restart.addEventListener("click", restartGame);
function restartGame() {
    multiplier = 1;
    speed = originalSpeed;
    background.style.display = "none";
    mainMenu.style.display = "none";
    clearInterval(createPipeInterval);
    pipeContainers.forEach(pipe => pipe.remove());
    pipeContainers = [];
    pipeContainerXPositions = [];
    pipeScored = [];
    resetVariables();
    gameover.style.display = "none";
    createPipeInterval = setInterval(createPipe, 1500);
    lastTime = performance.now();
    requestAnimationFrame(gameLoopFunction);
}
function resetVariables() {
    positionY = 300;
    velocity = 0;
    positionXGround = 0;
    positionXPipes = 300;
    score = 0;
    running = true;
    scoretext.innerHTML = `Score: ${score}`;
}
function MainMenu() {
    background.style.display = "block";
    mainMenu.style.display = "block";
    gameover.style.display = "none";
    running = false;
    clearInterval(createPipeInterval);
}
// FPS COUNTER
let frameCount = 0;
let fps = 0;
let visible = false;
let lastFpsTime = performance.now();
window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "f") {
        visible = !visible;
        fpsCounter.style.display = visible ? "block" : "none";
    }
});
function updateFPS(currentTime) {
    frameCount++;
    if (currentTime - lastFpsTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFpsTime = currentTime;
        fpsCounter.textContent = `FPS: ${fps}`;
    }
    requestAnimationFrame(updateFPS);
}
requestAnimationFrame(updateFPS);
const difficultySelect = document.getElementById("difficulty");
const difficultyDisplay = document.getElementById("difficulty-selection");
if (difficultySelect && difficultyDisplay) {
    difficultyDisplay.textContent = `Difficulty: ${difficultySelect.value}`;
    difficultySelect.addEventListener("change", () => {
        const selected = difficultySelect.value;
        difficultyDisplay.textContent = `Difficulty: ${selected}`;
    });
}
